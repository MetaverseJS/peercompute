/** Conversation consistency only: inspect the resident's own explicit decline,
 * never classify the user's subject matter or rewrite a declined request. */
export function residentDeclinedAction(text) {
  if (typeof text !== 'string') return false;
  const opening = text.trim().replaceAll('’', "'").replace(/^(?:(?:I'm |I am )?sorry[,!:]?\s*|unfortunately[,!:]?\s*|no[,!:]?\s*)+/i, '');
  return /^I\s+(?:cannot|can't|won't|will not|am unable to|'m unable to|am not able to|'m not able to|must decline to)\s+(?:help|assist|generate|create|make|provide|fulfi[ln]l|comply|do|change|turn|become|perform|execute)\b/i.test(opening)
    || /^(?:I'm|I am)\s+(?:unable|not able)\s+to\s+(?:help|assist|generate|create|make|provide|comply|do|change|turn|become|perform|execute)\b/i.test(opening);
}

export function residentReplyModelLabel(route) {
  if (typeof route?.modelName !== 'string' || !route.modelName.trim()) return '';
  const location = route.local === true ? 'local' : route.local === false ? 'peer' : '';
  return `${route.modelName.replaceAll('\0', '').trim().slice(0, 220)}${location ? ` · ${location}` : ''}`;
}
