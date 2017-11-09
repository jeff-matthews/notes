htmlproofer ./_site --only-4xx --log-level debug --checks-to-ignore "ScriptCheck,ImageCheck" --allow-hash-href "true" --alt-ignore "/.*/" --file-ignore "/guides/"
