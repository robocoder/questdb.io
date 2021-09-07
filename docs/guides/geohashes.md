---
title: Geospatial data
description:
  This document describes how to work with geohashes as geospatial types in
  QuestDB, including hints on converting back and forth from latitude and
  longitude, inserting via SQL, InfluxDB line protocol, CSV, and more.
---

QuestDB adds support for working with geospatial data through a `geohash` type.
This page describes how to use geohashes, with an overview of the syntax,
including hints on converting back and forth from latitude and longitude,
inserting via SQL, InfluxDB line protocol, and CSV import.

## Geohash description

A geohash is a convenient way of expressing a location using a short
alphanumeric string, with greater precision obtained with longer strings. The
basic idea is that the Earth is divided into regions of user-defined size, and
each area is assigned a unique id called its Geohash. For a given location on
Earth, we can convert latitude and longitude into a string. This string is the
Geohash and will determine which of the predefined regions the point belongs to.

In order to be compact, [base32](https://en.wikipedia.org/wiki/Base32#Geohash)
is used as a representation of Geohashes, and are therefore comprised of:

- all decimal digits (0-9) and
- almost all of the alphabet (case-insensitive) **except "a", "i", "l", "o"**.

The followng figure illustrates how increasing the length of a geohash results
in a higher-precision grid size:

import Screenshot from "@theme/Screenshot"

<Screenshot
  alt="The Create Instance wizard on Google Cloud platform"
  height={598}
  src="/img/docs/geohashes/increasing-precision.png"
  width={850}
/>

## QuestDB geohash type syntax

Geohash types are represented in QuestDB as `geohash(<precision>)`. Precision is
specified in the format `n{units}` where `n` is a numeric multiplier and `units`
may be one of `c` for char or `b` for bits.

The size of the `geohash` type may be:

- 1 to 12 chars or
- 1 to 60 bits

The following table shows all options for geohash precision using chars and the
calculated area of the grid the geohash refers to:

| Type           | Example        | Area              |
| -------------- | -------------- | ----------------- |
| `geohash(1c)`  | `u`            | 5,000km × 5,000km |
| `geohash(2c)`  | `u3`           | 1,250km × 625km   |
| `geohash(3c)`  | `u33`          | 156km × 156km     |
| `geohash(4c)`  | `u33d`         | 39.1km × 19.5km   |
| `geohash(5c)`  | `u33d8`        | 4.89km × 4.89km   |
| `geohash(6c)`  | `u33d8b`       | 1.22km × 0.61km   |
| `geohash(7c)`  | `u33d8b1`      | 153m × 153m       |
| `geohash(8c)`  | `u33d8b12`     | 38.2m × 19.1m     |
| `geohash(9c)`  | `u33d8b121`    | 4.77m × 4.77m     |
| `geohash(10c)` | `u33d8b1212`   | 1.19m × 0.596m    |
| `geohash(11c)` | `u33d8b12123`  | 149mm × 149mm     |
| `geohash(12c)` | `u33d8b121234` | 37.2mm × 18.6mm   |

For geohashes with size determined by `b` for bits, the following table compares
the precision of some geohashes with units expressed in bits compared to chars:

| Type (char)    | Equivalent to  |
| -------------- | -------------- |
| `geohash(1c)`  | `geohash(5b)`  |
| `geohash(6c)`  | `geohash(30b)` |
| `geohash(12c)` | `geohash(60b)` |

## SQL syntax for geohash inserts and queries

The following queries create a table with two `geohash` type columns of varying
precision and insert geohashes as string values:

```questdb-sql
CREATE TABLE my_geo_data (g1c geohash(1c), g8c geohash(8c));
INSERT INTO my_geo_data values('u', 'u33d8b12');
```

Larger-precision geohashes are truncated when inserted into smaller-precision
columns, and inserting smaller-precision geohases into larger-precision columns
produces an error, i.e.:

```questdb-sql
-- SQL will execute successfully with 'u33d8b12' truncated to 'u'
INSERT INTO my_geo_data values('u33d8b12', 'eet531sq');

-- Produces an error as 'e' is too short to cast to 8c_geohash column
INSERT INTO my_geo_data values('u', 'e');
```

Performing geospatial queries is done by checking if geohash values are equal to
or within other geohashes. Consider the following table:

```questdb-sql
CREATE TABLE geo_data (ts timestamp, device_id symbol, g1c geohash(1c), g8c geohash(8c));
```

This creates a table with a `symbol` type column as an identifier and we can
insert values as follows:

```questdb-sql
INSERT INTO geo_data values(now(), 'device_1', 'u', 'u33d8b12');
INSERT INTO geo_data values(now(), 'device_1', 'u', 'u33d8b18');
INSERT INTO geo_data values(now(), 'device_2', 'e', 'ezzn5kxb');
INSERT INTO geo_data values(now(), 'device_1', 'u', 'u33d8b1b');
INSERT INTO geo_data values(now(), 'device_2', 'e', 'ezzn5kxc');
INSERT INTO geo_data values(now(), 'device_3', 'e', 'u33dr01d');
```

This table contains the following values:

| ts                          | device_id | g1c | g8c      |
| --------------------------- | --------- | --- | -------- |
| 2021-09-02T14:20:04.669312Z | device_1  | u   | u33d8b12 |
| 2021-09-02T14:20:06.553721Z | device_1  | u   | u33d8b12 |
| 2021-09-02T14:20:07.095639Z | device_1  | u   | u33d8b18 |
| 2021-09-02T14:20:07.721444Z | device_2  | e   | ezzn5kxb |
| 2021-09-02T14:20:08.241489Z | device_1  | u   | u33d8b1b |
| 2021-09-02T14:20:08.807707Z | device_2  | e   | ezzn5kxc |
| 2021-09-02T14:20:09.280980Z | device_3  | e   | u33dr01d |

We can check if the last-known location of a device is a specific geohash with
the following query:

```questdb-sql title="cast usage"
SELECT * FROM geo_data LATEST BY device_id
WHERE g8c = cast('u33dr01d' AS geohash(8c))
```

This will return an exact match based on geohash:

| ts                          | device_id | g1c | g8c      |
| --------------------------- | --------- | --- | -------- |
| 2021-09-02T14:20:09.280980Z | device_3  | e   | u33dr01d |

### Geohash literals

Geohash literals may be declared in insert statements by using `#` followed by
up to 12 chars, i.e.:

```questdb-sql
INSERT INTO my_geo_data VALUES(#u33)
INSERT INTO my_geo_data VALUES(#u33d8b12)
```

Alternatively as `##` followed by up to 60 bits ['0', '1']:

```questdb-sql
INSERT INTO my_geo_data VALUES(##0111001001001001000111000110)
```

### Prefix-like matching using within

The `within` keyword can be used as a prefix match to evaluate if a geohash
comprising a smaller area exists within a larger grid. The following query will
return the most recent entries by device ID if the `g8c` column contains a
geohash within `u33d`:

```questdb-sql title="LATEST BY usage"
SELECT * FROM geo_data LATEST BY device_id
WHERE g8c WITHIN ('u33d');
```

| ts                          | device_id | g1c | g8c      |
| --------------------------- | --------- | --- | -------- |
| 2021-09-02T14:20:08.241489Z | device_1  | u   | u33d8b1b |
| 2021-09-02T14:20:09.280980Z | device_3  | e   | u33dr01d |

## Cast

Geohashes may be cast from strings during queries in the following manner:

```questdb-sql
SELECT * FROM geo_data
WHERE g8c = cast('v9q2c3gu' as geohash(8c))
```

## Changing precision

TODO - incoming changes

## InfluxDB line protocol

Geohashes may also be inserted via InfluxDB line protocol. In order to perform
inserts in this way;

1. Create table with columns of geohash type beforehand:

```questdb-sql
CREATE TABLE tracking (ts timestamp, geohash geohash(8c));
```

2. Inserts via InfluxDB line protocol using the `geohash` field:

```bash
tracking geohash="46swgj10"
```

Inserting geohashes with larger precision will result in the value being
truncated, i.e.:

```bash
geo_data geohash="46swgj10r88k"
# Equivalent to:
geo_data geohash="46swgj10"
```

## Postgres

TODO - incoming changes

:::info

When querying geohash values over Postgres wire protocol, QuestDB always returns
geohashes in text mode (i.e. as strings) as opposed to binary

:::

## CSV import

TODO

## API usage

TODO

### Size

In terms of storage for geohash values internally, there are four categories of
storage size:

- Up to 7-bit geohashes are stored as `bytes` internally
- 8-bit to 15-bit geohashes are stored as `short` types
- 16-bit to 31-bit geohashes are stored as `int` types
- 32-bit to 60-bit geohashes are stored as `long` types
