import { Option as CommanderOption } from 'commander';

import type { Option } from '../constants/cli';

export default function getCLIOption({
  flags,
  description,
  default: defaultValue,
  defaultDescription,
  choices,
  conflicts
}: Option): CommanderOption {
  const option = new CommanderOption(flags, description);
  if (defaultValue !== void 0 || defaultDescription) {
    option.default(defaultValue ?? null, defaultDescription);
  }
  if (choices && choices.length) {
    option.choices(choices);
  }
  if (conflicts) {
    option.conflicts(conflicts);
  }
  return option;
}
