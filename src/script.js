// Gestion du menu hamburger mobile
function nav() {
    const liens = document.querySelector('.liensBurger');
    liens.classList.toggle('shown');
}
(async function initCyberGlobe() {
    const canvas = document.getElementById('cyber-globe');
    const ctx = canvas.getContext('2d');

    const size = 760;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const colors = {
        bgSphere: '#0c1015',
        graticule: 'rgba(61, 56, 70, 0.32)',
        landFill: 'rgba(38, 162, 105, 0.22)',
        landStroke: '#26a269',
        rimGlow: 'rgba(38, 162, 105, 0.55)'
    };

    const projection = d3.geoOrthographic()
        .scale(size * 0.44)
        .translate([size / 2, size / 2])
        .rotate([0, -16, -12]);

    const path = d3.geoPath(projection, ctx);
    const graticule = d3.geoGraticule10();

    const world = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json');
    const land = topojson.feature(world, world.objects.land);

    function render() {
        ctx.clearRect(0, 0, size, size);

        ctx.save();
        ctx.beginPath();
        path({ type: 'Sphere' });
        ctx.fillStyle = colors.bgSphere;
        ctx.shadowColor = colors.rimGlow;
        ctx.shadowBlur = 32;
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = colors.rimGlow;
        ctx.stroke();
        ctx.restore();

        ctx.beginPath();
        path(graticule);
        ctx.lineWidth = 0.8;
        ctx.strokeStyle = colors.graticule;
        ctx.stroke();

        ctx.beginPath();
        path(land);
        ctx.fillStyle = colors.landFill;
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = colors.landStroke;
        ctx.stroke();
    }

    const state = { lon: 0 };
    anime({
        targets: state,
        lon: 360,
        duration: 48000,
        easing: 'linear',
        loop: true,
        update: () => {
            projection.rotate([state.lon, -16, -12]);
            render();
        }
    });
})();