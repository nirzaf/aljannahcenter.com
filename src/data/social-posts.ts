// Public posts from the Centre's official channels, shown in the social feed
// alongside anything staff share from the staff desk (/admin).
// Collected from the public profile pages on 10 Oct 2026, newest first.

/** TikTok videos from @aljannah.centre (video ids). */
const tiktokVideos = [
  "7694624413127396615", "7694299976318422279", "7693236530420206856",
  "7692523351385967880", "7690845659896761608", "7690482923278961938",
  "7689510585100242183", "7684553421889834247", "7682359253692140807",
  "7682357714541907208", "7674566102566931730", "7674535996943322376",
  "7674527519399267592", "7674318421575748882", "7674130076962704647",
  "7673937843831557394", "7670892577985416466", "7670365113790041362",
  "7670142729162067208", "7663472267283696904", "7661545910589066504",
  "7655989780890651911", "7655249350250990855", "7653729741027003666",
  "7653432437074185479", "7652657448834092295", "7652315095887908114",
  "7618289849241586962", "7617889968626912520", "7616340894458875154",
  "7614580093599386898", "7612761295397391623", "7611599307908713746",
  "7610104957538225415", "7609225648669740306", "7609002635508665618",
  "7607892602611928327",
];

/** Instagram posts and reels from @aljannahcentre. */
const instagramPosts = [
  "reel/DeRY6n_oqn5", "reel/DePLy2Ro1ED", "p/DeJf2I5IOvT", "reel/DeHyFHVo5Sn",
  "p/DeGhHZTIy13", "p/DeFRk_skWl-", "p/DeFRW7FEbNa", "p/DeFRF5GkWh_",
  "p/DeFQ3ZPkbZ6", "p/DeFQk4LkRDk", "reel/DeCmqXvoBDo", "p/Dd-0sRsI9P0",
  "reel/DdLgN7IJRfa", "p/DdGuV0zCC0P", "p/DdGpeflCM4d", "p/DdGn-MGiHtL",
  "p/DdGnkpSiA1B", "p/DdGZM6fiHlf", "p/DdGW4nxiDai", "p/DdGU2JFCCFW",
  "p/DdGTZkhiC4h",
];

/** Facebook posts from the Al - Jannah Centre page. */
const facebookPosts = [
  "reel/1076320675293016", "photo/?fbid=1483741320467690",
  "photo/?fbid=1482730030568819", "photo/?fbid=1482330817275407",
  "photo/?fbid=1482330747275414", "photo/?fbid=1482330670608755",
  "photo/?fbid=1482328880608934", "photo/?fbid=1482328810608941",
  "photo/?fbid=1482328653942290", "photo/?fbid=1482328607275628",
];

export const officialSocialPosts: string[] = [
  ...tiktokVideos.map((id) => "https://www.tiktok.com/@aljannah.centre/video/" + id),
  ...instagramPosts.map((path) => "https://www.instagram.com/" + path + "/"),
  ...facebookPosts.map((path) => "https://www.facebook.com/" + path),
];
