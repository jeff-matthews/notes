## List redirect logs

```bash
aws s3 ls docs.magento.com-logs/lambda/redirects-updater/
```

## Copy logs

```bash
aws s3 cp s3://docs.magento.com-logs/lambda/redirects-updater/devdocs.magedevteam.com_2019-05-02T20:52:53.244Z.log logs.txt
```
