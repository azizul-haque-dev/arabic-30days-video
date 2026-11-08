import { chipRect, R, ROW } from "./layout";
import { toBn } from "../utils/bn";
import type { EpisodeConfig, IllusZone, Rect, SceneKind, SceneSpec, TextSpec, UiBox } from "../types";

/**
 * Declarative layout for every scene kind. Scenes render exactly these zones and scripts/validate.ts
 * checks exactly these zones, so the layout that is validated is the layout that is rendered.
 * Every text element owns a zone of its own; zones never intersect and illustration zones are clipped.
 */
type TextOpts = Partial<Omit<TextSpec, "id" | "zone" | "paragraphs">>;
const T = (id: string, zone: Rect, paragraphs: string | string[], o: TextOpts = {}): TextSpec => ({
  id, zone, paragraphs: Array.isArray(paragraphs) ? paragraphs : [paragraphs],
  weight: 700, color: "text", maxFont: 64, minFont: 40, lineHeight: 1.35, align: "center", ...o,
});
const U = (id: string, rect: Rect, kind: UiBox["kind"], contains?: string[]): UiBox => ({ id, rect, kind, contains });

function header(cfg: EpisodeConfig, badge: string): { texts: TextSpec[]; ui: UiBox[] } {
  return {
    texts: [
      T("brand", R(170, 110, 460, 80), cfg.brandName, { maxFont: 46, minFont: 32, lineHeight: 1.3, align: "left" }),
      T("badge", R(704, 110, 292, 80), badge, { maxFont: 40, minFont: 28, lineHeight: 1.3, color: "white" }),
    ],
    ui: [U("logo", R(70, 110, 80, 80), "logo"), U("badgePanel", R(690, 110, 320, 80), "panel", ["badge"])],
  };
}
const dayBadge = (cfg: EpisodeConfig) => `${cfg.copy.labels.day} ${cfg.episodeNumber}`;

function chips(cfg: EpisodeConfig, area: Rect, done = false): { texts: TextSpec[]; ui: UiBox[] } {
  const texts: TextSpec[] = [], ui: UiBox[] = [];
  for (let i = 0; i < 10; i++) {
    const n = cfg.sentenceStart + i;
    const r = chipRect(area, i);
    texts.push(T(`chip-${n}`, R(r.x + 8, r.y + 8, r.w - 16, r.h - 16), toBn(n), { maxFont: 52, minFont: 34, lineHeight: 1.3, color: done ? "white" : "text" }));
    ui.push(U(`chipPanel-${n}`, r, "chip", [`chip-${n}`]));
  }
  return { texts, ui };
}

export function getSceneSpec(kind: SceneKind, cfg: EpisodeConfig, sentenceNo?: number): SceneSpec {
  const c = cfg.copy;
  const ill = (id: string, zone: Rect, layers: IllusZone["layers"]): IllusZone => ({ id, zone, layers, clip: true });
  switch (kind) {
    case "thumbnail": {
      const h = header(cfg, dayBadge(cfg));
      return {
        texts: [...h.texts,
          T("title", R(70, 230, 940, 190), c.thumb.title, { color: "primaryDark", maxFont: 70, minFont: 52, lineHeight: 1.3, paragraphGap: 4 }),
          T("hook", ROW(1190, 140), c.thumb.hook, { maxFont: 100, minFont: 64, lineHeight: 1.3 }),
          T("sub", ROW(1360, 260), c.thumb.sub, { weight: 600, color: "primaryDark", maxFont: 68, minFont: 48 })],
        illustrations: [ill("thumb", ROW(450, 690), cfg.illustrations.thumbnail)], ui: h.ui,
      };
    }
    case "story": {
      const h = header(cfg, dayBadge(cfg));
      return {
        texts: [...h.texts, T("headline", ROW(1030, 200), c.story.headline, { color: "primary", maxFont: 130, minFont: 80, lineHeight: 1.3 })],
        illustrations: [ill("story", ROW(260, 720), cfg.illustrations.story)], ui: h.ui,
      };
    }
    case "brand":
      return {
        texts: [
          T("wordmark", ROW(760, 160), cfg.brandName, { color: "primaryDark", maxFont: 120, minFont: 72, lineHeight: 1.25 }),
          T("tagline", ROW(950, 220), c.brand.tagline, { weight: 600, maxFont: 68, minFont: 48 })],
        illustrations: [], ui: [U("logoBig", R(390, 400, 300, 300), "logo")],
      };
    case "episode":
      return {
        texts: [
          T("series", ROW(320, 110), cfg.seriesName, { weight: 600, color: "secondary", maxFont: 60, minFont: 40, lineHeight: 1.3 }),
          T("dayLabel", R(330, 510, 420, 110), c.labels.day, { color: "white", maxFont: 90, minFont: 60, lineHeight: 1.3 }),
          T("dayNum", R(330, 650, 420, 300), String(cfg.episodeNumber), { color: "white", maxFont: 260, minFont: 160, lineHeight: 1.1 }),
          T("line", ROW(1060, 260), c.episode.line, { weight: 600, maxFont: 64, minFont: 44, lineHeight: 1.4 })],
        illustrations: [], ui: [U("dayPanel", R(290, 480, 500, 500), "panel", ["dayLabel", "dayNum"])],
      };
    case "progressDone":
      return {
        texts: [
          T("lead", ROW(360, 140), c.progressDone.lead, { color: "primaryDark", maxFont: 100, minFont: 64, lineHeight: 1.3 }),
          T("counter", ROW(540, 260), `${toBn(cfg.previousCompletedSentences)}/${toBn(cfg.totalSentences)}`, { color: "primary", maxFont: 180, minFont: 120, lineHeight: 1.2 }),
          T("line", ROW(980, 220), c.progressDone.line, { weight: 600, maxFont: 64, minFont: 44, lineHeight: 1.4 })],
        illustrations: [], ui: [U("bar", ROW(860, 56), "bar")],
      };
    case "topic": {
      const h = header(cfg, dayBadge(cfg));
      const ch = chips(cfg, ROW(570, 262));
      return {
        texts: [...h.texts,
          T("lead", ROW(250, 90), c.topic.lead, { weight: 600, color: "secondary", maxFont: 56, minFont: 40, lineHeight: 1.3 }),
          T("range", ROW(365, 155), `${toBn(cfg.sentenceStart)} – ${toBn(cfg.sentenceEnd)}`, { color: "primary", maxFont: 130, minFont: 100, lineHeight: 1.15 }),
          ...ch.texts,
          T("topicBn", R(440, 930, 540, 200), cfg.topicBn, { maxFont: 84, minFont: 56, lineHeight: 1.3, cue: "title" }),
          T("topicEn", R(440, 1150, 540, 110), cfg.topic, { weight: 600, color: "secondary", maxFont: 52, minFont: 36, lineHeight: 1.3, cue: "title", delaySec: 0.25 }),
          T("go", R(90, 1360, 900, 120), c.topic.go, { maxFont: 64, minFont: 44, lineHeight: 1.3, cue: "go" })],
        illustrations: [ill("topicCard", R(90, 900, 320, 380), cfg.illustrations.topicCard)],
        ui: [...h.ui, ...ch.ui, U("topicPanel", ROW(880, 420), "panel", ["topicBn", "topicEn"]), U("goPill", ROW(1360, 120), "chip", ["go"])],
      };
    }
    case "sentence": {
      const s = cfg.sentences.find((x) => x.number === sentenceNo);
      if (!s) throw new Error(`No sentence ${sentenceNo} in episode.config.json`);
      const h = header(cfg, `${c.labels.sentence} ${toBn(s.number)}`);
      const rows: Rect[] = s.pron.length === 1 ? [ROW(990, 300)] : [ROW(990, 100), ROW(1178, 100)];
      const pronOpts: TextOpts = { color: "primaryDark", maxFont: s.pron.length === 1 ? 100 : 76, minFont: 56, lineHeight: 1.3 };
      const texts: TextSpec[] = [...h.texts,
        T("pronLabel", ROW(926, 40), c.labels.pronunciation, { weight: 600, color: "secondary", maxFont: 34, minFont: 26, lineHeight: 1.2 }),
        T("pron-0", rows[0], s.pron[0], { ...pronOpts, cue: "pron" })];
      if (s.pron.length > 1) {
        texts.push(T("or", ROW(1114, 40), c.labels.or, { weight: 600, color: "secondary", maxFont: 34, minFont: 26, lineHeight: 1.2, cue: "alt" }));
        texts.push(T("pron-1", rows[1], s.pron[1], { ...pronOpts, cue: "alt", delaySec: 0.15 }));
      }
      texts.push(
        T("meaningLabel", ROW(1320, 40), c.labels.meaning, { weight: 600, color: "secondary", maxFont: 34, minFont: 26, lineHeight: 1.2, cue: "meaning" }),
        T("meaning", ROW(1384, 236), s.meaning, { weight: 600, maxFont: 68, minFont: 44, lineHeight: 1.4, cue: "meaning", delaySec: 0.12 }));
      return {
        texts, illustrations: [ill(`sentence-${s.number}`, ROW(230, 670), s.layers)],
        ui: [...h.ui, U("progress", ROW(1660, 48), "bar")],
      };
    }
    case "outroDone": {
      const h = header(cfg, dayBadge(cfg));
      const ch = chips(cfg, ROW(570, 262), true);
      return {
        texts: [...h.texts, T("title", ROW(250, 260), c.outro.done, { color: "primaryDark", maxFont: 84, minFont: 56, lineHeight: 1.3, paragraphGap: 6 }), ...ch.texts],
        illustrations: [], ui: [...h.ui, ...ch.ui, U("confetti", ROW(880, 500), "decor")],
      };
    }
    case "outroProgress":
      return {
        texts: [
          T("lead", ROW(330, 140), c.outro.progressLead, { color: "primaryDark", maxFont: 100, minFont: 64, lineHeight: 1.3 }),
          T("counter", ROW(500, 260), `${toBn(cfg.completedSentences)}/${toBn(cfg.totalSentences)}`, { color: "primary", maxFont: 180, minFont: 120, lineHeight: 1.2 }),
          T("pct", ROW(920, 120), `${toBn(cfg.progressPercentage)}% ${c.labels.done}`, { weight: 600, maxFont: 64, minFont: 44, lineHeight: 1.3 })],
        illustrations: [ill("strip", ROW(1100, 330), cfg.illustrations.outroStrip)], ui: [U("bar", ROW(820, 56), "bar")],
      };
    case "outroPractice":
      return {
        texts: [
          T("title", ROW(280, 240), c.outro.practice, { color: "primaryDark", maxFont: 76, minFont: 52 }),
          T("sub", ROW(1260, 200), c.outro.practiceSub, { weight: 600, maxFont: 62, minFont: 44, lineHeight: 1.4, cue: "sub" })],
        illustrations: [ill("practice", ROW(550, 670), cfg.illustrations.outroPractice)], ui: [],
      };
    case "outroFollow":
      return {
        texts: [
          T("text", ROW(590, 300), c.outro.follow, { maxFont: 64, minFont: 44, lineHeight: 1.4 }),
          T("followBtn", R(270, 920, 540, 120), c.labels.follow, { color: "text", maxFont: 60, minFont: 40, lineHeight: 1.3 }),
          T("saveLabel", R(210, 1310, 260, 70), c.labels.save, { weight: 600, color: "secondary", maxFont: 48, minFont: 32, lineHeight: 1.3 }),
          T("shareLabel", R(610, 1310, 260, 70), c.labels.share, { weight: 600, color: "secondary", maxFont: 48, minFont: 32, lineHeight: 1.3 })],
        illustrations: [], ui: [
          U("logoBig", R(410, 290, 260, 260), "logo"), U("followPill", R(270, 920, 540, 120), "chip", ["followBtn"]),
          U("saveIcon", R(210, 1090, 260, 200), "icon"), U("shareIcon", R(610, 1090, 260, 200), "icon")],
      };
    case "outroComment":
      return {
        texts: [
          T("lead", ROW(330, 140), c.outro.commentLead, { maxFont: 90, minFont: 60, lineHeight: 1.3 }),
          T("cta", R(100, 550, 880, 240), cfg.ctaText, { color: "white", maxFont: 150, minFont: 90, lineHeight: 1.3, cue: "cta" })],
        illustrations: [], ui: [U("ctaPanel", ROW(520, 300), "panel", ["cta"]), U("commentBubbles", R(270, 900, 540, 420), "decor")],
      };
    case "outroGoodbye":
      return {
        texts: [
          T("seeYou", ROW(640, 150), c.outro.seeYou, { maxFont: 100, minFont: 64, lineHeight: 1.3 }),
          T("next", R(310, 850, 460, 260), `${c.labels.day} ${cfg.nextEpisodeNumber}`, { color: "white", maxFont: 130, minFont: 80, lineHeight: 1.3 }),
          T("insha", ROW(1180, 140), c.outro.insha, { color: "primaryDark", maxFont: 90, minFont: 60, lineHeight: 1.3 }),
          T("brandLine", ROW(1350, 100), cfg.brandName, { weight: 600, color: "secondary", maxFont: 52, minFont: 36, lineHeight: 1.3 })],
        illustrations: [], ui: [U("logoBig", R(400, 310, 280, 280), "logo"), U("nextPanel", R(290, 830, 500, 300), "panel", ["next"])],
      };
  }
}
