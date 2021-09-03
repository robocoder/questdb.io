---
title: Geospatial functions
sidebar_label: Spatial
description: Geospatial functions reference documentation.
---

Spatial functions allow for operations relating to the geohash types which
provide geospatial data support. For more information on this type of data, see
the [geohashes documentation](/docs/guides/geohashes/).

## within

`within(geohash, ...)` - evaluates if a comma-separated list of geohash values
are equal to are within another geohash.

`within(geohash)` works only as part of a `LATEST BY` query as a means of
filtering results.

**Arguments:**

- `geohash` is a geohash type in text or binary form

**Return value:**

- evaluates to `true` if geohash values are a prefix or complete match based on
  the geohashes passed as arguments

**Examples:**

Given a table with the following contents:

| ts                          | device_id | g1c | g8c      |
| --------------------------- | --------- | --- | -------- |
| 2021-09-02T14:20:07.721444Z | device_2  | e   | ezzn5kxb |
| 2021-09-02T14:20:08.241489Z | device_1  | u   | u33w4r2w |
| 2021-09-02T14:20:08.241489Z | device_3  | u   | u33d8b1b |

The `within` function can be used to filter results by geohash:

```questdb-sql
SELECT * FROM pos LATEST BY uuid
WHERE g8c within('ezz', 'u33d8');
```

This yields the following results:

| ts                          | device_id | g1c | g8c      |
| --------------------------- | --------- | --- | -------- |
| 2021-09-02T14:20:07.721444Z | device_2  | e   | ezzn5kxb |
| 2021-09-02T14:20:08.241489Z | device_3  | u   | u33d8b1b |

Additionally, prefix-like matching can be performed to evaluate if geohashes
exist within a larger grid:

```questdb-sql
SELECT * FROM pos LATEST BY uuid
WHERE g8c within('u33');
```

| ts                          | device_id | g1c | g8c      |
| --------------------------- | --------- | --- | -------- |
| 2021-09-02T14:20:08.241489Z | device_1  | u   | u33w4r2w |
| 2021-09-02T14:20:08.241489Z | device_3  | u   | u33d8b1b |

## rnd_geohash

`rnd_geohash(bits)` returns a random geohash of variable precision.

**Arguments:**

`bits` - an integer between `1` and `60` which determines the precision of the
generated geohash.

**Return value:**

Returns a `geohash`

**Examples:**

```questdb-sql
SELECT rnd_geohash(7) g7,
      rnd_geohash(10) g10,
      rnd_geohash(30) g30,
      rnd_geohash(29) g29,
      rnd_geohash(60) g60
FROM long_sequence(5);
```

| g7      | g10 | g30    | g29                           | g60          |
| ------- | --- | ------ | ----------------------------- | ------------ |
| 1101100 | 4h  | hsmmq8 | 01110101011001101111110111011 | rjtwedd0z72p |
| 0010011 | vf  | f9jc1q | 10101111100101111111101101101 | fzj09w97tj1h |
| 0101011 | kx  | fkhked | 01110110010001001000110001100 | v4cs8qsnjkeh |
| 0000001 | 07  | qm99sm | 11001010011011000010101100101 | hrz9gq171nc5 |
| 0101011 | 6t  | 3r8jb5 | 11011101010111001010010001010 | fm521tq86j2c |

## make_geohash

`make_geohash(lon, lat, bits)` returns a geohash equivalent of latitude and
longitude, with precision specified in bits.

**Arguments:**

- `lon` - longitude coordinate as a floating point value with up to eight
  decimal places
- `lat` - latitude coordinate as a floating point value with up to eight decimal
  places
- `bits` - an integer between `1` and `60` which determines the precision of the
  generated geohash.

The latitude and longitude arguments may be constants, column values or the
results of a function which produces them.

**Return value:**

Returns a `geohash`.

- If latitude and longitude comes from constants and is incorrect, an error is
  thrown
- If column values have invalid lat / long coordinates, this produces `null`.

**Examples:**

```questdb-sql
SELECT make_geohash(142.89124148, -12.90604153, 40)
```
