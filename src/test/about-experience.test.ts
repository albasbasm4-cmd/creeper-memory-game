import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';

const html = readFileSync('public/app.html', 'utf8');
const fitSource = html.slice(html.indexOf('  function fitAbout()'), html.indexOf("  addEventListener('resize', fitAbout)"));
const transitionSource = html.slice(html.indexOf('  function startExplosion()'), html.indexOf('  function goHome()'));
const musicOffset = Number(html.match(/const ABOUT_MUSIC_START = ([\d.]+);/)?.[1]);

describe('About Us experience', () => {
  it('uses a landscape viewport on a 360 by 646 portrait phone', () => {
    const overlay = { style: {} as Record<string, string>, dataset: {} };
    new Function('s2', 'innerWidth', 'innerHeight', fitSource + ';fitAbout();')(overlay, 360, 646);
    expect(overlay.style['width']).toBe('646px');
    expect(overlay.style['height']).toBe('360px');
    expect(overlay.style['transform']).toBe('translate(-50%,-50%) rotate(90deg)');
  });

  it('does not rotate an already landscape screen', () => {
    const overlay = { style: {} as Record<string, string>, dataset: {} };
    new Function('s2', 'innerWidth', 'innerHeight', fitSource + ';fitAbout();')(overlay, 1280, 720);
    expect(overlay.style['width']).toBe('1280px');
    expect(overlay.style['height']).toBe('720px');
    expect(overlay.style['transform']).toBe('translate(-50%,-50%)');
  });

  it('reveals the photo and starts music synchronously past the 1.307-second silent lead-in', () => {
    const overlay = { style: {} as Record<string, string>, dataset: {} };
    const music = { currentTime: 0, play: vi.fn(() => {
      expect(overlay.style['opacity']).toBe('1');
      expect(music.currentTime).toBe(1.31);
      return Promise.resolve();
    }) };
    const setPos = vi.fn();
    const schedule = vi.fn();
    new Function('s2', 'aboutMusic', 'setPos', 'setTimeout', 'ABOUT_MUSIC_START', `
      let screen2Visible=false, state='look', fusingT=0, fusePhase=0, exploded=false, parts=[], userTouched=false, aboutTimer=0;
      const FUSE_DUR=1.2, SW=1536, SH=691, tap={style:{}}, ctx2={clearRect(){}};
      ${transitionSource}
      startExplosion(); startExplosion();
    `)(overlay, music, setPos, schedule, musicOffset);
    expect(music.play).toHaveBeenCalledTimes(1);
    expect(setPos).toHaveBeenCalledWith('big', false);
    expect(schedule).toHaveBeenCalledTimes(1);
    expect(schedule.mock.calls[0]?.[1]).toBe(5000);
  });
});