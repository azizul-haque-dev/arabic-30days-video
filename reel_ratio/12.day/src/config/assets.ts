export interface AssetDef { file: string; w: number; h: number }
const I = (f: string, w: number, h: number): AssetDef => ({ file: `assets/illustrations/${f}.svg`, w, h });
/** Registry of every illustration. w/h = the SVG viewBox, used for layout maths and validation. */
export const ASSETS: Record<string, AssetDef> = {
  storeInterior: I("store-interior", 940, 670), storeFront: I("store-front", 800, 560),
  customer: I("customer", 260, 520), cashier: I("cashier", 260, 420), counter: I("counter", 560, 230),
  shelf: I("shelf", 520, 330), bag: I("bag", 180, 220), product: I("product", 140, 200),
  pos: I("pos", 220, 260), card: I("card", 220, 140), cash: I("cash", 260, 150), coins: I("coins", 200, 110),
  printer: I("printer", 240, 200), receipt: I("receipt", 140, 260), tv: I("tv", 300, 240),
  warranty: I("warranty", 200, 260), returnCounter: I("return-counter", 460, 300),
  discountBanner: I("discount-banner", 600, 200), priceTag: I("price-tag", 200, 200),
  cart: I("cart", 300, 280), basket: I("basket", 240, 200), bubble: I("bubble", 220, 170),
  arrowReturn: I("arrow-return", 160, 160), checkBadge: I("check-badge", 140, 140),
};
export const LOGO: AssetDef = { file: "assets/branding/logo.svg", w: 240, h: 240 };
