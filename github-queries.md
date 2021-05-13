# merged PRs

Need to run these queries on both devdocs and merchdocs repos and add/subtract totals accordingly.

1. Show all merged PRs for a month (external contributors only)

   ```text
   is:pr is:merged closed:2020-12-01..2020-12-31 repo:magento/devdocs -label:"Internal Dev" -label:"Maintenance" -label:"Site improvements" -label:"Automation" -author:"meker12" -author:"dshevtsov" -author:"dobooth" -author:"jeff-matthews" -author:"keharper" -author:"hguthrie" -author:"leslietilling" -author:"jfrontain" -author:"erikmarr" -author:"shrielenee" -author:"jcalcaben" -author:"hickskenh" -author:"bdenham" -author:"ccondra" -author:"danidelcar"
   ```

1. Show all merged PRs for a month (internal contributors only)

   Subtract the total from this query:

   ```text
   is:pr is:merged closed:2020-12-01..2020-12-31 repo:magento/devdocs
   ```

   From the external contributors only query above.

1. Show all merged PRs for a month (partners)

   ```text
   is:pr is:merged closed:2020-12-01..2020-12-31 repo:magento/devdocs -label:"Internal Dev" -label:"Maintenance" -label:"Site improvements" -label:"Automation" -author:"meker12" -author:"dshevtsov" -author:"dobooth" -author:"jeff-matthews" -author:"keharper" -author:"hguthrie" -author:"leslietilling" -author:"jfrontain" -author:"erikmarr" -author:"shrielenee" -author:"jcalcaben" -author:"hickskenh" -author:"bdenham" -author:"ccondra" -author:"danidelcar" -author:"imgbot[bot]" label:"partners-contribution"
   ```

1. Show all merged PRs for a month (non-partner)

   ```text
   is:pr is:merged closed:2020-12-01..2020-12-31 repo:magento/devdocs -label:"Internal Dev" -label:"Maintenance" -label:"Site improvements" -label:"Automation" -author:"meker12" -author:"dshevtsov" -author:"dobooth" -author:"jeff-matthews" -author:"keharper" -author:"hguthrie" -author:"leslietilling" -author:"jfrontain" -author:"erikmarr" -author:"shrielenee" -author:"jcalcaben" -author:"hickskenh" -author:"bdenham" -author:"ccondra" -author:"danidelcar" -label:"partners-contribution"
   ```
