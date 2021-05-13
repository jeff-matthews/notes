# Ideas

- Adobe.io & Experience League

  - Strategic migration
  - Landing pages

- GitHub delivery workflow changes
- Release notes optimization (internal & external)
- AI/ML for aggregating content from disparate sources for docs
- Refactor Install Guide
- Embedded help
- Getting started
  - S4M
  - Extension dev
  - Theme dev
- TCO docs
  - Upgrade planning and execution

# Release notes

- Stop doing in-line attribution for community contributions; the tables are sufficient
- Make sure that Maura is adding GraphQL features/highlights to Misha's overview deck
  - We don't need to be trying to stitch together disparate epics that comprise a feature
  - How do we prevent pulling duplicate data for graphql fixes that have been fixed by community but have a MC Jira ticket associated with them for internal team tracking
  - Can we exclude Jira tickets created by API user with a parameter and then just rely on GH for the external fixes?
  - Was there a problem with the Jira ticket creation that was putting the wrong GH link in the issue or vice versa? Has that been fixed?
    - Yes, the former. Fixed.

# Release notes optimization

- Get recommendatino from ERic GReen re: required field and new field and whether we should apply to all projects now or MC first and other projects later for standardization
- Follow up with leadership on Eric's receommendatiioni
- Reach out to Chris when ready to get some time in his team's stand up to pitch this (10 mins)
- Guliz and Chris to send join email announcement to org

## Conversation with Eric

### 10/29/20

#### Recommendations

- Modify the new template that MC will be migrating to as part of the Adobe migration.

  - ETA is after Q1 2021 release on 2/9/21.

- Figure out how to programmatically require release notes field for bug issue types.

  - For example, make release notes field required if an issue meets any of the following criteria:

    - Issues found during regression
    - Issues that affect internal tests only
    - Issues that  identify potential security vulnerabilities
    - Duplicate or unreproducible issues

  - There is an existing field in the template called **Demand Source** that we might be able to use.
  
    - However, it could get complicated depending on how many teams need to use it and for what purposes.
    - The alternative is to request a custom field **OR** use a boolean (e.g., Release notes required?)
    - A better alternative might be the **RCA Code** list.

#### Questions

- Is Product Management and Engineering already planning to track the data we want to use to categorize bug fixes for release notes? If so, how?
- Is there a way to restrict the proposed bug issue behavior to the MC project instead of forcing it on all other projects that use the same project template?

#### Action items

- Jeff

  - Discuss options for categorizing bugs with Misha Chernenko and Corey Dulimba
  - Schedule follow up with Eric the week of 11/9 (end of week)

- Eric

  - Follow up with Nizar and Oleksii re: migration timeline and number of teams that need to work in the project.

## 11/16/20

- (Jeff, Misha, Corey, Jeanne) Options for categorizing bug issues (e.g., Demand Source, RCA Code, custom field, or Boolean)
  - We refer to add the following classes to the RCA Code list
    - Security
    - Regression
    - Internal test? (is this different from regression)
  - We prefer to defer the decision to create a custom field and use the RCA Code field until after experimenting with the MC project. If it works well and needs to be extended to other Jira projects, we can re-implement using a custom field across Jira projects later.

- (Eric) Update on MC migration to Adobe Jira (and new project template)
  - The MC migration has not yet been scheduled.

### Action items

- Jeff - Talk to Oleksii and Nizar about proposal. Find out whether they're interested in tracking this info and if they have a better idea to do so that also meets our release notes need.
- Jeff - Send concise write up with final recommendations to all stakeholders.

## 11/30/20

- Nizar not open to new field for product functional area because we can already achieve the same purpose with the Component field
  - How do we ensure the Component field is used correctly?
  - What happens when multiple components are added?
  - Validate that other product owners own Components and not just Misha.

- Oleksii suggested drafting release notes as part of the triage process and getting Jeanne involved in triage to assist.
  - This is a good option even if it simplify identifies the issue in a succinct way.

### Action items

- Jeff to send summary to stakeholders.
