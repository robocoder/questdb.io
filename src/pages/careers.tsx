import clsx from "clsx"
import React, { useCallback, useRef } from "react"

import Button from "@theme/Button"
import PageLayout from "@theme/PageLayout"

import caCss from "../css/careers/card.module.css"
import joCss from "../css/careers/job.module.css"
import liCss from "../css/careers/list.module.css"
import seCss from "../css/section.module.css"

const CareersPage = () => {
  const title = "Careers at QuestDB"
  const description =
    "Join us at QuestDB to build breakthrough technology that will power the infrastructure of tomorrow."
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const handleClick = useCallback(() => {
    titleRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [titleRef])

  return (
    <PageLayout canonical="/careers" description={description} title={title}>
      <section
        className={clsx(seCss["section--inner"], seCss["section--center"])}
      >
        <div className={caCss.card}>
          <div className={caCss.card__side}>
            <h1 className={caCss["card__title--important"]}>Careers</h1>
            <p className={caCss.card__content}>
              We help developers handle explosive amounts of data while getting
              them started in just a few minutes with the simplest and most
              accessible time series database.
            </p>
            <Button className={caCss.card__cta} onClick={handleClick}>
              Current openings
            </Button>
          </div>
          <div
            className={clsx(
              caCss.card__side,
              caCss["card__side--illustration"],
            )}
          >
            <img
              alt="Illustration of team collaboration"
              height={201}
              src="/img/pages/careers/teamCollaboration.svg"
              width={305}
            />
          </div>
        </div>
        <div className={clsx(caCss.card, caCss["card--reverse"])}>
          <div
            className={clsx(
              caCss.card__side,
              caCss["card__side--illustration"],
              caCss["card__side--baseline"],
            )}
          >
            <img
              alt="Illustration of team spirit"
              height={230}
              src="/img/pages/careers/teamSpirit.svg"
              width={305}
            />
          </div>
          <div className={caCss.card__side}>
            <h2 className={caCss.card__title}>Working at QuestDB</h2>
            <p className={caCss.card__content}>
              We hire talented and passionate people who share our mission to
              empower developers to solve their problems with data. We are
              building breakthrough technology to power the infrastructure of
              tomorrow.
            </p>
            <ul className={liCss.list}>
              <li className={liCss.list__item}>
                We are a company with thousands of users; our mission is to
                empower them.
              </li>
              <li className={liCss.list__item}>
                We invest in a culture that promotes ownership, autonomy and
                independent thinking.
              </li>
              <li className={liCss.list__item}>
                We have transparent leadership and value employees’ strategic
                inputs.
              </li>
              <li className={liCss.list__item}>
                Our team is ambitious and tackles the most difficult problems at
                the deepest data infrastructure layer.
              </li>
            </ul>
          </div>
        </div>
        <div className={caCss.card}>
          <div className={caCss.card__side}>
            <h2 className={caCss.card__title} ref={titleRef}>
              Current openings
            </h2>
          </div>
          <div className={clsx(caCss.card__side, caCss["card__side--center"])}>
            <a className={joCss.job} href="head-of-talent/">
              <h3 className={joCss.job__title}>Head of Talent</h3>
              <p className={joCss.job__location}>Remote</p>
              <span className={joCss.job__cta}>
                Details&nbsp;
                <img
                  alt="Right arrow"
                  height={20}
                  src="/img/pages/careers/arrowRight.svg"
                  width={20}
                />
              </span>
            </a>
            <a className={joCss.job} href="senior-cloud-engineer/">
              <h3 className={joCss.job__title}>Senior Cloud Engineer</h3>
              <p className={joCss.job__location}>Remote</p>
              <span className={joCss.job__cta}>
                Details&nbsp;
                <img
                  alt="Right arrow"
                  height={20}
                  src="/img/pages/careers/arrowRight.svg"
                  width={20}
                />
              </span>
            </a>
            <a className={joCss.job} href="developer-relations-engineer/">
              <h3 className={joCss.job__title}>Developer Relations Engineer</h3>
              <p className={joCss.job__location}>Remote</p>
              <span className={joCss.job__cta}>
                Details&nbsp;
                <img
                  alt="Right arrow"
                  height={20}
                  src="/img/pages/careers/arrowRight.svg"
                  width={20}
                />
              </span>
            </a>
            <a className={joCss.job} href="backend-software-engineer/">
              <h3 className={joCss.job__title}>Software Engineer, Backend</h3>
              <p className={joCss.job__location}>Remote</p>
              <span className={joCss.job__cta}>
                Details&nbsp;
                <img
                  alt="Right arrow"
                  height={20}
                  src="/img/pages/careers/arrowRight.svg"
                  width={20}
                />
              </span>
            </a>
            <a className={joCss.job} href="front-end-engineer/">
              <h3 className={joCss.job__title}>
                Lead Software Engineer, Frontend
              </h3>
              <p className={joCss.job__location}>Remote</p>
              <span className={joCss.job__cta}>
                Details&nbsp;
                <img
                  alt="Right arrow"
                  height={20}
                  src="/img/pages/careers/arrowRight.svg"
                  width={20}
                />
              </span>
            </a>
          </div>
        </div>
        <div className={clsx(caCss.card, caCss["card--reverse"])}>
          <div
            className={clsx(
              caCss.card__side,
              caCss["card__side--illustration"],
              caCss["card__side--baseline"],
            )}
          >
            <img
              alt="Illustration of a developer with efficient"
              height={230}
              src="/img/pages/careers/timeseriesApplication.svg"
              width={305}
            />
          </div>
          <div className={caCss.card__side}>
            <h2 className={caCss.card__title}>About QuestDB</h2>
            <p className={caCss.card__content}>
              We have built the fastest open source time series database from
              the ground up to offer breakthrough performance for real-time
              analytics using SQL.
            </p>
            <p className={caCss.card__content}>
              We bring experience and technical approaches from low-latency
              trading to leverage real-time data processing in various use cases
              and industries.
            </p>
            <p className={caCss.card__content}>
              Our users deploy QuestDB to make time series analysis fast,
              efficient, and convenient in financial services, IoT, application
              monitoring, and machine learning. We are a remote-first company
              based in London and backed by leading venture capital firms and Y
              Combinator.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

export default CareersPage
