/* ===== 粒子系统：对象池复用，零 GC 压力 ===== */
window.NR = window.NR || {};

NR.particles = (function () {
  const POOL_SIZE = 90;
  const pool = [];
  let sceneRef = null;

  function init(scene) {
    sceneRef = scene;
    const tex = NR.textures.glow();
    for (let i = 0; i < POOL_SIZE; i++) {
      const m = new THREE.SpriteMaterial({
        map: tex, color: 0xffffff, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false
      });
      const s = new THREE.Sprite(m);
      s.visible = false;
      scene.add(s);
      pool.push({ s, life: 0, maxLife: 1, vel: new THREE.Vector3(), grav: 0, size: 0.3 });
    }
  }

  /* 生成单个粒子 */
  function spawn(x, y, z, color, size, life, vx, vy, vz, grav) {
    for (let i = 0; i < pool.length; i++) {
      const p = pool[i];
      if (p.life <= 0) {
        p.life = p.maxLife = life;
        p.size = size; p.grav = grav || 0;
        p.vel.set(vx, vy, vz);
        p.s.position.set(x, y, z);
        p.s.material.color.setHex(color);
        p.s.visible = true;
        return;
      }
    }
  }

  /* 爆裂效果 */
  function burst(x, y, z, color, n, spd) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = (0.4 + Math.random() * 0.6) * spd;
      spawn(x, y, z, color, 0.25 + Math.random() * 0.2, 0.45 + Math.random() * 0.3,
        Math.cos(a) * r, Math.random() * spd * 0.9, Math.sin(a) * r * 0.5, -6);
    }
  }

  function update(dt, worldSpd) {
    for (let i = 0; i < pool.length; i++) {
      const p = pool[i];
      if (p.life <= 0) continue;
      p.life -= dt;
      if (p.life <= 0) { p.s.visible = false; p.s.material.opacity = 0; continue; }
      p.vel.y += p.grav * dt;
      p.s.position.x += p.vel.x * dt;
      p.s.position.y += p.vel.y * dt;
      p.s.position.z += (p.vel.z + worldSpd) * dt;
      const k = p.life / p.maxLife;
      p.s.material.opacity = k * 0.85;
      const sc = p.size * (0.6 + (1 - k) * 0.9);
      p.s.scale.set(sc, sc, 1);
    }
  }

  return { init, spawn, burst, update };
})();
