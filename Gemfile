# Mirrors GitHub Pages' own build (Jekyll, plugins, and their versions), so a
# local `bundle exec jekyll serve` renders what the live site will.
source "https://rubygems.org"

# github-pages >= 232 depends on commonmarker 0.x, which doesn't build on Ruby
# 4, so this needs Ruby 3.x (see README.md).
ruby ">= 3.0", "< 4.0"

gem "github-pages", ">= 232", group: :jekyll_plugins

# Ruby 3 dropped webrick from the standard library, and `jekyll serve` needs it.
gem "webrick"
