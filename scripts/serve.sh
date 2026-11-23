#!/usr/bin/env bash
# Serves the site at http://localhost:4000 with `bundle exec jekyll serve`,
# installing gems first when they're missing. Extra arguments go to Jekyll,
# e.g. `scripts/serve.sh --livereload`. DEVELOPMENT.md covers the setup.
set -euo pipefail

cd "$(dirname "$0")/.."

ruby_is_3() {
    command -v ruby >/dev/null && ruby -e 'exit RUBY_VERSION.start_with?("3.")'
}

# The Gemfile needs Ruby 3.x, while macOS ships 2.6, so fall back to
# Homebrew's ruby@3.3 (the version DEVELOPMENT.md installs) when it isn't
# already on PATH. If `brew --prefix` fails (say, once the formula is gone),
# the install hint below prints rather than `set -e` ending the script.
if ! ruby_is_3 && command -v brew >/dev/null; then
    if brew_prefix="$(brew --prefix ruby@3.3 2>/dev/null)" && [ -x "$brew_prefix/bin/ruby" ]; then
        export PATH="$brew_prefix/bin:$PATH"
    fi
fi
if ! ruby_is_3; then
    echo "Ruby 3.x is required. Install it with \`brew install ruby@3.3\` (see DEVELOPMENT.md)." >&2
    exit 1
fi

# Gems install inside the repo (vendor/ is git-ignored), as DEVELOPMENT.md sets up.
if [ -z "$(bundle config get --parseable path)" ]; then
    bundle config set --local path vendor/bundle
fi
bundle check >/dev/null || bundle install

exec bundle exec jekyll serve "$@"
