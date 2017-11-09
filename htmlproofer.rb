require 'html-proofer'

# Add to repo and run with:
# ruby htmlproofer.rb

options = {
  log_level: "debug",
  only_4xx: true,
  checks_to_ignore: ["ScriptCheck", "ImageCheck"],
  allow_hash_ref: true,
  alt_ignore: [/.*/],
  # file_ignore: [/guides/, /swagger/],
  parallel: { :in_processes => 3 },
  typhoeus: { :followlocation => true, :connecttimeout => 10, :timeout => 30 },
  hydra: { :max_concurrency => 50 },
  cache: { :timeframe => '30d' }
}
HTMLProofer.check_directory("./_site", options).run

Unable to ignore directories using strings
