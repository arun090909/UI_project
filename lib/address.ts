export const US_STATES = [
  "", "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois",
  "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana",
  "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah",
  "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
  "Washington, D.C.",
];

// Approximate USPS ZIP3 prefix ranges per state, used to catch a ZIP code
// that doesn't belong to the selected state.
const ZIP3_RANGES_BY_STATE: Record<string, [number, number][]> = {
  Alabama: [[350, 352], [354, 369]],
  Alaska: [[995, 999]],
  Arizona: [[850, 853], [855, 857], [859, 860], [863, 865]],
  Arkansas: [[716, 729]],
  California: [[900, 908], [910, 928], [930, 961]],
  Colorado: [[800, 816]],
  Connecticut: [[60, 69]],
  Delaware: [[197, 199]],
  "Washington, D.C.": [[200, 200], [202, 205]],
  Florida: [[320, 347], [349, 349]],
  Georgia: [[300, 319], [398, 399]],
  Hawaii: [[967, 968]],
  Idaho: [[832, 839]],
  Illinois: [[600, 620], [622, 629]],
  Indiana: [[460, 479]],
  Iowa: [[500, 528]],
  Kansas: [[660, 679]],
  Kentucky: [[400, 427]],
  Louisiana: [[700, 701], [703, 708], [710, 714]],
  Maine: [[39, 49]],
  Maryland: [[206, 219]],
  Massachusetts: [[10, 27], [55, 55]],
  Michigan: [[480, 499]],
  Minnesota: [[550, 567]],
  Mississippi: [[386, 397]],
  Missouri: [[630, 658]],
  Montana: [[590, 599]],
  Nebraska: [[680, 693]],
  Nevada: [[889, 891], [893, 895], [897, 898]],
  "New Hampshire": [[30, 38]],
  "New Jersey": [[70, 89]],
  "New Mexico": [[870, 884]],
  "New York": [[4, 5], [100, 149]],
  "North Carolina": [[270, 289]],
  "North Dakota": [[580, 588]],
  Ohio: [[430, 459]],
  Oklahoma: [[730, 741], [743, 749]],
  Oregon: [[970, 979]],
  Pennsylvania: [[150, 196]],
  "Rhode Island": [[28, 29]],
  "South Carolina": [[290, 299]],
  "South Dakota": [[570, 577]],
  Tennessee: [[370, 385]],
  Texas: [[750, 799], [885, 885]],
  Utah: [[840, 847]],
  Vermont: [[50, 59]],
  Virginia: [[201, 201], [220, 246]],
  Washington: [[980, 994]],
  "West Virginia": [[247, 268]],
  Wisconsin: [[530, 549]],
  Wyoming: [[820, 831]],
};

export function zipMatchesState(zip: string, state: string): boolean {
  const ranges = ZIP3_RANGES_BY_STATE[state];
  if (!ranges) return true; // no data for this state — don't block submission
  const prefix = parseInt(zip.slice(0, 3), 10);
  return ranges.some(([min, max]) => prefix >= min && prefix <= max);
}
