import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

const html = readFileSync("public/app.html", "utf8");
const fitSource = html.slice(html.indexOf("  function fitAbout()"), html.indexOf("  addEventListener('resize', fitAbout)"));
const transitionSource = html.slice(html.indexOf("  function startExplosion()"), html.indexOf("  function goHome()"));
const musicOffset = Number(html.match(/const ABOUT_MUSIC_START = ([\d.]+);/)?.[1]);

describe("About Us experience", () => {
  it("uses a landscape viewport on a 360 by 646 portrait phone", () => {
    const overlay = { style: {} as Record<string, string>, dataset: {} };
    new Function("s2", "innerWidth", "innerHeight", fitSource + ";fitAbout();")(overlay, 360, 646);
    expect(overlay.style["width"]).toBe("646px");
    expect(overlay.style["height"]).toBe("360px");
    expect(overlay.style["transform"]).toBe("translate(-50%,-50%) rotate(90deg)");
  });

  it("does not rotate an already landscape screen", () => {
    const overlay = { style: {} as Record<string, string>, dataset: {} };
    new Function("s2", "innerWidth", "innerHeight", fitSource + ";fitAbout();")(overlay, 1280, 720);
    expect(overlay.style["width"]).toBe("1280px");
    expect(overlay.style["height"]).toBe("720px");
    expect(overlay.style["transform"]).toBe("translate(-50%,-50%)");
  });

  it("reveals the photo and starts music synchronously past the 1.307-second silent lead-in", () => {
    const overlay = { style: {} as Record<string, string>, dataset: {} };
    const music = { currentTime: 0, play: vi.fn(() => {
      expect(overlay.style["opacity"]).toBe("1");
      expect(music.currentTime).toBe(1.31);
      return Promise.resolve();
    }) };
    const setPos = vi.fn();
    const schedule = vi.fn();
    new Function("s2", "aboutMusic", "setPos", "setTimeout", "ABOUT_MUSIC_START", `
      let screen2Visible=false, state='look', fusingT=0, fusePhase=0, exploded=false, parts=[], userTouched=false, aboutTimer=0;
      const FUSE_DUR=1.2, SW=1536, SH=691, tap={style:{}}, ctx2={clearRect(){}};
      ${transitionSource}
      startExplosion(); startExplosion();
    `)(overlay, music, setPos, schedule, musicOffset);
    expect(music.play).toHaveBeenCalledTimes(1);
    expect(setPos).toHaveBeenCalledWith("big", false);
    expect(schedule).toHaveBeenCalledTimes(1);
    expect(schedule.mock.calls[0]?.[1]).toBe(5000);
  });

  it("hides the home button during big photo view and reveals it cleanly once photo moves to icon", () => {
    const setPosSource = html.slice(
      html.indexOf("  function setPos(k, animate) {"),
      html.indexOf("  function startExplosion()")
    );
    const portrait = { style: {} as Record<string, string> };
    const title = { style: {} as Record<string, string> };
    const text = { style: {} as Record<string, string> };
    const home = { style: {} as Record<string, string> };
    const s2 = { dataset: {} as Record<string, string> };
    const POS = {
      big:  {left:"7.5%",top:"clamp(52px,12vmin,90px)",width:"85%",height:"calc(100% - clamp(52px,12vmin,90px))",borderRadius:"24px"},
      icon: {left:"18px",top:"18px",width:"clamp(56px,12vmin,100px)",height:"clamp(56px,12vmin,100px)",borderRadius:"50%"}
    };

    const runSetPos = new Function(
      "aboutPortrait", "aboutTitle", "aboutText", "aboutHome", "s2", "POS",
      setPosSource + "; return setPos;"
    )(portrait, title, text, home, s2, POS);

    // Initial big state
    runSetPos("big", false);
    expect(home.style["opacity"]).toBe("0");
    expect(home.style["pointerEvents"]).toBe("none");
    expect(text.style["pointerEvents"]).toBe("none");

    // Transition to icon
    runSetPos("icon", true);
    expect(home.style["opacity"]).toBe("1");
    expect(home.style["pointerEvents"]).toBe("auto");
    expect(text.style["pointerEvents"]).toBe("auto");

    // Tapping icon to restore big photo hides home button again
    runSetPos("big", true);
    expect(home.style["opacity"]).toBe("0");
    expect(home.style["pointerEvents"]).toBe("none");
  });

  it("configures small, balanced dimensions for the home button in HTML", () => {
    const match = html.match(/<button id="aboutHome"[^>]+style="([^"]+)"/);
    expect(match).toBeTruthy();
    const style = match![1];
    expect(style).toContain("width:clamp(38px,6.2vmin,48px)");
    expect(style).toContain("height:clamp(38px,6.2vmin,48px)");
    expect(style).toContain("border-radius:50%");
    expect(style).toContain("opacity:0");
    expect(style).toContain("pointer-events:none");
  });

  it("configures smooth, stable scrolling with touch-action pan-y and direct scroll-behavior", () => {
    expect(html).toContain("touch-action:pan-y");
    expect(html).toContain("scroll-behavior:auto");
    expect(html).toContain("overscroll-behavior:contain");
    expect(html).toContain("s2.addEventListener('wheel', handleWheel");
    expect(html).toContain("s2.addEventListener('touchmove', onTouchMove");
  });

  it("configures gentle auto-scroll on icon phase that halts on user interaction", () => {
    expect(html).toContain("function startAutoScroll");
    expect(html).toContain("function stopAutoScroll");
    expect(html).toContain("function onUserInterruptScroll");
    expect(html).toContain("aboutText.addEventListener('pointerdown', onUserInterruptScroll");
    expect(html).toContain("aboutText.addEventListener('touchstart', onUserInterruptScroll");
    expect(html).toContain("startAutoScroll()");
  });
});
