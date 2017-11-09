We use Jekyll as our content management system for Edge Cases.
It works great, except site generation was getting slow. We have a over a gigabyte of audio now, and Jekyll apparently dutifully copies it all each time the site is regenerated. That currently takes about 40s on my machine with an SSD.
It dawned on me that rsync is optimized for this task, so this is how I relieved Jekyll of that duty.
First I renamed our previous audio directory to `_audio` so Jekyll would ignore it (Jekyll ignores everything starting with an underscore when generating a site).
Then I wrote a simple plugin and put it in `_plugins/rsync_audio_generator.rb`:
``` ruby
module Jekyll    
    class RsyncAudioGenerator < Generator
        def generate(site)
            system('mkdir -p _site'); # We may be called before _site exists.
            system('rsync --archive --delete _audio/ _site/audio/');
        end
    end
end
```
Initially it didn’t work since during Jekyll’s clean-up build phase it would spot the “audio” directory in the `_site` output directory that didn’t exist in the input directory and would happily delete all of rsync’s hard work.
It was easy enough to instruct Jekyll to lay off by adding the following line to the `_config.yml`:
``` yaml
keep_files: ["audio"]
```
As expected, site regen times have plummeted, now clocking in around 3s.
