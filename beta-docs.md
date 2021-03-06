- BICs that go through the approval process must use the approved template so that we can extract that data for use in BIC Highlights. this is a good example of good docs: https://jira.corp.magento.com/browse/MC-30428
- approvers will push back on BIC tickets when sufficient docs are not present. Engineering must provide this documentation so that there is very little clean up to do on our end
- around feature complete for 2.4 (5/1), Misha will helps us with the JQL to gather all BICs for a release so we can manually PR into BIC highlights topic
- briefly refer to BIC highlights in release notes (above-the-fold or somewhere very visible) and link to the corresponding BIC highlights section anchor for more explanation
- BIC highlights should succinctly summarize impact to help customers understand whether it affects them; they currently have difficulty ascertaining this with current docs
- provide a generic explanation for why we include BICs in patch releases
- start publishing 2.4 docs (primarily release notes and BICs) to production at 2.4 feature complete (5/1)
- continue using devdocs-beta environment for patch release deliverables prior to GA (beta, pre-release)