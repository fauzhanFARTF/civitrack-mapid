/* CiviTrack Mini — vanilla MapLibre app
 * Fitur: marker + cluster, radius, isochrone, heatmap, route (jarak + estimasi waktu), search.
 * Author: Fauzan Nurrachman
 */

(function () {
  'use strict';

  const CONFIG = {
    center: [106.8456, -6.2088],
    zoom: 11,
    mapidApiKey: '69e7cccae8dfc566983dd1c9',
    mapidBaseUrl: 'https://routing.mapid.io',
    osrmBaseUrl: 'https://router.project-osrm.org',
    osmRoutingBaseUrl: 'https://routing.openstreetmap.de',
    nominatimBaseUrl: 'https://nominatim.openstreetmap.org',
  };

  const TYPE_META = {
    hospital: { color: '#ef4444', label: 'RS Umum' },
    clinic: { color: '#eab308', label: 'Klinik / Puskesmas' },
    pharmacy: { color: '#10b981', label: 'Apotek' },
  };

  // -------- Sample data: fasilitas kesehatan Jabodetabek --------
  const SAMPLE_POINTS = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          id: 1,
          name: 'RSCM (RS Cipto Mangunkusumo)',
          type: 'hospital',
          address: 'Jl. Diponegoro No.71, Senen, Jakarta Pusat',
        },
        geometry: { type: 'Point', coordinates: [106.8456, -6.1936] },
      },
      {
        type: 'Feature',
        properties: {
          id: 2,
          name: 'RS Pondok Indah',
          type: 'hospital',
          address: 'Jl. Metro Duta Kav. UE, Pondok Indah, Jaksel',
        },
        geometry: { type: 'Point', coordinates: [106.7836, -6.2659] },
      },
      {
        type: 'Feature',
        properties: {
          id: 3,
          name: 'RS Premier Bintaro',
          type: 'hospital',
          address: 'Jl. MH Thamrin Blok B3 No.1, Bintaro',
        },
        geometry: { type: 'Point', coordinates: [106.7257, -6.2746] },
      },
      {
        type: 'Feature',
        properties: {
          id: 4,
          name: 'RS Mitra Keluarga Kelapa Gading',
          type: 'hospital',
          address: 'Jl. Bukit Gading Raya Kav.2, Jakarta Utara',
        },
        geometry: { type: 'Point', coordinates: [106.9012, -6.1525] },
      },
      {
        type: 'Feature',
        properties: {
          id: 5,
          name: 'RS Siloam TB Simatupang',
          type: 'hospital',
          address: 'Jl. RA Kartini No.8, Cilandak, Jaksel',
        },
        geometry: { type: 'Point', coordinates: [106.8005, -6.2899] },
      },
      {
        type: 'Feature',
        properties: {
          id: 6,
          name: 'RS Fatmawati',
          type: 'hospital',
          address: 'Jl. RS Fatmawati Raya No.4, Jaksel',
        },
        geometry: { type: 'Point', coordinates: [106.7972, -6.2934] },
      },
      {
        type: 'Feature',
        properties: {
          id: 7,
          name: 'RS Pusat Pertamina',
          type: 'hospital',
          address: 'Jl. Kyai Maja No.43, Jaksel',
        },
        geometry: { type: 'Point', coordinates: [106.7977, -6.2402] },
      },
      {
        type: 'Feature',
        properties: {
          id: 8,
          name: 'RS Hermina Jatinegara',
          type: 'hospital',
          address: 'Jl. Raya Jatinegara Barat No.126, Jaktim',
        },
        geometry: { type: 'Point', coordinates: [106.8689, -6.2245] },
      },
      {
        type: 'Feature',
        properties: {
          id: 9,
          name: 'RS Persahabatan',
          type: 'hospital',
          address: 'Jl. Persahabatan Raya No.1, Pulogadung, Jaktim',
        },
        geometry: { type: 'Point', coordinates: [106.8946, -6.1872] },
      },
      {
        type: 'Feature',
        properties: {
          id: 10,
          name: 'RS Pelni',
          type: 'hospital',
          address: 'Jl. Aipda KS Tubun No.92-94, Jakbar',
        },
        geometry: { type: 'Point', coordinates: [106.8023, -6.1846] },
      },
      {
        type: 'Feature',
        properties: {
          id: 11,
          name: 'RS Husada',
          type: 'hospital',
          address: 'Jl. Mangga Besar Raya No.137-139, Jakpus',
        },
        geometry: { type: 'Point', coordinates: [106.8225, -6.1463] },
      },
      {
        type: 'Feature',
        properties: {
          id: 12,
          name: 'RS Harapan Kita',
          type: 'hospital',
          address: 'Jl. Letjen S. Parman Kav.87, Jakbar',
        },
        geometry: { type: 'Point', coordinates: [106.7926, -6.1779] },
      },
      {
        type: 'Feature',
        properties: {
          id: 13,
          name: 'RS Pondok Aren',
          type: 'hospital',
          address: 'Jl. Pondok Aren Raya, Tangerang Selatan',
        },
        geometry: { type: 'Point', coordinates: [106.7185, -6.268] },
      },
      {
        type: 'Feature',
        properties: {
          id: 14,
          name: 'RS Eka Hospital BSD',
          type: 'hospital',
          address: 'CBD Lot IX Boulevard Pahlawan Seribu, BSD',
        },
        geometry: { type: 'Point', coordinates: [106.651, -6.3022] },
      },
      {
        type: 'Feature',
        properties: {
          id: 15,
          name: 'RS Pondok Indah Puri Indah',
          type: 'hospital',
          address: 'Jl. Puri Indah Raya Blok S-2, Jakbar',
        },
        geometry: { type: 'Point', coordinates: [106.7372, -6.1856] },
      },
      {
        type: 'Feature',
        properties: {
          id: 16,
          name: 'RSUD Tarakan',
          type: 'hospital',
          address: 'Jl. Kyai Caringin No.7, Cideng, Jakpus',
        },
        geometry: { type: 'Point', coordinates: [106.8105, -6.1665] },
      },
      {
        type: 'Feature',
        properties: {
          id: 17,
          name: 'RS Gandaria',
          type: 'hospital',
          address: 'Jl. Sultan Iskandar Muda No.1, Jaksel',
        },
        geometry: { type: 'Point', coordinates: [106.7853, -6.2454] },
      },
      {
        type: 'Feature',
        properties: {
          id: 18,
          name: 'RSUD Pasar Minggu',
          type: 'hospital',
          address: 'Jl. TB Simatupang No.1, Pasar Minggu, Jaksel',
        },
        geometry: { type: 'Point', coordinates: [106.8351, -6.2916] },
      },
      {
        type: 'Feature',
        properties: {
          id: 19,
          name: 'Puskesmas Tebet',
          type: 'clinic',
          address: 'Jl. Prof. Soepomo SH No.54, Tebet, Jaksel',
        },
        geometry: { type: 'Point', coordinates: [106.8557, -6.2299] },
      },
      {
        type: 'Feature',
        properties: {
          id: 20,
          name: 'Puskesmas Setiabudi',
          type: 'clinic',
          address: 'Jl. HR Rasuna Said, Setiabudi, Jaksel',
        },
        geometry: { type: 'Point', coordinates: [106.8302, -6.2204] },
      },
      {
        type: 'Feature',
        properties: {
          id: 21,
          name: 'Puskesmas Menteng',
          type: 'clinic',
          address: 'Jl. Pegangsaan Barat No.18, Menteng, Jakpus',
        },
        geometry: { type: 'Point', coordinates: [106.8364, -6.1968] },
      },
      {
        type: 'Feature',
        properties: {
          id: 22,
          name: 'Puskesmas Kebayoran Lama',
          type: 'clinic',
          address: 'Jl. Hijau Daun, Kebayoran Lama, Jaksel',
        },
        geometry: { type: 'Point', coordinates: [106.7785, -6.2363] },
      },
      {
        type: 'Feature',
        properties: {
          id: 23,
          name: 'Klinik Kimia Farma Sudirman',
          type: 'clinic',
          address: 'Jl. Jend. Sudirman Kav.10-11, Jakpus',
        },
        geometry: { type: 'Point', coordinates: [106.8201, -6.2078] },
      },
      {
        type: 'Feature',
        properties: {
          id: 24,
          name: 'Klinik Pratama Cilandak',
          type: 'clinic',
          address: 'Jl. Cilandak Tengah, Jaksel',
        },
        geometry: { type: 'Point', coordinates: [106.8088, -6.279] },
      },
      {
        type: 'Feature',
        properties: {
          id: 25,
          name: 'Puskesmas Kemayoran',
          type: 'clinic',
          address: 'Jl. Serdang Baru I, Kemayoran, Jakpus',
        },
        geometry: { type: 'Point', coordinates: [106.8519, -6.1611] },
      },
      {
        type: 'Feature',
        properties: {
          id: 26,
          name: 'Puskesmas Mampang Prapatan',
          type: 'clinic',
          address: 'Jl. Kapten P. Tendean, Mampang, Jaksel',
        },
        geometry: { type: 'Point', coordinates: [106.8244, -6.2433] },
      },
      {
        type: 'Feature',
        properties: {
          id: 27,
          name: 'Klinik Tirta Medical Centre',
          type: 'clinic',
          address: 'Jl. Kemang Raya No.34, Jaksel',
        },
        geometry: { type: 'Point', coordinates: [106.8137, -6.2614] },
      },
      {
        type: 'Feature',
        properties: {
          id: 28,
          name: 'Klinik Prodia Menteng',
          type: 'clinic',
          address: 'Jl. Kramat Raya No.150, Jakpus',
        },
        geometry: { type: 'Point', coordinates: [106.8419, -6.1828] },
      },
      {
        type: 'Feature',
        properties: {
          id: 29,
          name: 'Puskesmas Ciracas',
          type: 'clinic',
          address: 'Jl. Raya Bogor Km.24, Ciracas, Jaktim',
        },
        geometry: { type: 'Point', coordinates: [106.8688, -6.3185] },
      },
      {
        type: 'Feature',
        properties: {
          id: 30,
          name: 'Puskesmas Pulogadung',
          type: 'clinic',
          address: 'Jl. Pulomas Selatan, Pulogadung, Jaktim',
        },
        geometry: { type: 'Point', coordinates: [106.8845, -6.1812] },
      },
      {
        type: 'Feature',
        properties: {
          id: 31,
          name: 'Apotek Century Senayan',
          type: 'pharmacy',
          address: 'Senayan City Mall, Jaksel',
        },
        geometry: { type: 'Point', coordinates: [106.7984, -6.227] },
      },
      {
        type: 'Feature',
        properties: {
          id: 32,
          name: 'Apotek Guardian Plaza Indonesia',
          type: 'pharmacy',
          address: 'Plaza Indonesia, Thamrin, Jakpus',
        },
        geometry: { type: 'Point', coordinates: [106.8234, -6.1934] },
      },
      {
        type: 'Feature',
        properties: {
          id: 33,
          name: 'Apotek K-24 Tebet',
          type: 'pharmacy',
          address: 'Jl. Tebet Raya, Tebet, Jaksel',
        },
        geometry: { type: 'Point', coordinates: [106.8528, -6.2364] },
      },
      {
        type: 'Feature',
        properties: {
          id: 34,
          name: 'Apotek Kimia Farma Salemba',
          type: 'pharmacy',
          address: 'Jl. Salemba Raya No.4, Jakpus',
        },
        geometry: { type: 'Point', coordinates: [106.848, -6.1991] },
      },
      {
        type: 'Feature',
        properties: {
          id: 35,
          name: 'Apotek Roxy Cikini',
          type: 'pharmacy',
          address: 'Jl. Cikini Raya No.60, Jakpus',
        },
        geometry: { type: 'Point', coordinates: [106.8398, -6.1922] },
      },
      {
        type: 'Feature',
        properties: {
          id: 36,
          name: 'Apotek Watson Kelapa Gading',
          type: 'pharmacy',
          address: 'Mall of Indonesia, Kelapa Gading',
        },
        geometry: { type: 'Point', coordinates: [106.9051, -6.1571] },
      },
      {
        type: 'Feature',
        properties: {
          id: 37,
          name: 'RS Hasanah Graha Afiah',
          type: 'hospital',
          address: 'Jl. Raden Saleh No.42, Sukmajaya, Depok',
        },
        geometry: { type: 'Point', coordinates: [106.8203, -6.4032] },
      },
      {
        type: 'Feature',
        properties: {
          id: 38,
          name: 'RS Mitra Keluarga Depok',
          type: 'hospital',
          address: 'Jl. Margonda Raya No.23, Depok',
        },
        geometry: { type: 'Point', coordinates: [106.8246, -6.375] },
      },
      {
        type: 'Feature',
        properties: {
          id: 39,
          name: 'RSUD Bekasi',
          type: 'hospital',
          address: 'Jl. Pramuka No.55, Bekasi',
        },
        geometry: { type: 'Point', coordinates: [107.001, -6.2378] },
      },
      {
        type: 'Feature',
        properties: {
          id: 40,
          name: 'RS Mitra Keluarga Bekasi',
          type: 'hospital',
          address: 'Jl. Jend. Ahmad Yani, Bekasi',
        },
        geometry: { type: 'Point', coordinates: [107.0099, -6.2454] },
      },
      {
        type: 'Feature',
        properties: {
          id: 41,
          name: 'RS Hermina Bogor',
          type: 'hospital',
          address: 'Jl. Ring Road I Kav.23, Bogor',
        },
        geometry: { type: 'Point', coordinates: [106.8074, -6.5664] },
      },
      {
        type: 'Feature',
        properties: {
          id: 42,
          name: 'RSUD Kota Bogor',
          type: 'hospital',
          address: 'Jl. Dr. Sumeru No.120, Bogor',
        },
        geometry: { type: 'Point', coordinates: [106.7866, -6.598] },
      },
      {
        type: 'Feature',
        properties: {
          id: 43,
          name: 'RS Hermina Tangerang',
          type: 'hospital',
          address: 'Jl. KS Tubun No.10, Tangerang',
        },
        geometry: { type: 'Point', coordinates: [106.6312, -6.1786] },
      },
      {
        type: 'Feature',
        properties: {
          id: 44,
          name: 'RS Awal Bros Tangerang',
          type: 'hospital',
          address: 'Jl. MH Thamrin No.3, Tangerang',
        },
        geometry: { type: 'Point', coordinates: [106.6302, -6.1751] },
      },
      {
        type: 'Feature',
        properties: {
          id: 45,
          name: 'RS Bethsaida Hospital',
          type: 'hospital',
          address: 'Gading Serpong, Tangerang',
        },
        geometry: { type: 'Point', coordinates: [106.623, -6.239] },
      },
      {
        type: 'Feature',
        properties: {
          id: 46,
          name: 'RS Pondok Indah Bintaro Jaya',
          type: 'hospital',
          address: 'Sektor IX Bintaro Jaya, Tangsel',
        },
        geometry: { type: 'Point', coordinates: [106.7029, -6.2862] },
      },
      {
        type: 'Feature',
        properties: {
          id: 47,
          name: 'Puskesmas Beji',
          type: 'clinic',
          address: 'Jl. Beji Tengah No.50, Depok',
        },
        geometry: { type: 'Point', coordinates: [106.8157, -6.3815] },
      },
      {
        type: 'Feature',
        properties: {
          id: 48,
          name: 'Puskesmas Cinere',
          type: 'clinic',
          address: 'Jl. Cinere Raya, Depok',
        },
        geometry: { type: 'Point', coordinates: [106.7892, -6.3196] },
      },
      {
        type: 'Feature',
        properties: {
          id: 49,
          name: 'Puskesmas Cibinong',
          type: 'clinic',
          address: 'Jl. Mayor Oking, Cibinong, Bogor',
        },
        geometry: { type: 'Point', coordinates: [106.8484, -6.4823] },
      },
      {
        type: 'Feature',
        properties: {
          id: 50,
          name: 'Klinik Pratama Bekasi Timur',
          type: 'clinic',
          address: 'Jl. Cut Meutia, Bekasi Timur',
        },
        geometry: { type: 'Point', coordinates: [107.0204, -6.2491] },
      },
    ],
  };

  const BASEMAPS = {
    osm: {
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      attribution: '&copy; OpenStreetMap contributors',
    },
    'carto-light': {
      tiles: [
        'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      ],
      attribution: '&copy; OSM, &copy; CARTO',
    },
    'carto-dark': {
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      ],
      attribution: '&copy; OSM, &copy; CARTO',
    },
    'esri-sat': {
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ],
      attribution: 'Tiles &copy; Esri — Esri, Maxar, Earthstar Geographics',
    },
  };

  const buildStyle = (key) => {
    const bm = BASEMAPS[key] || BASEMAPS.osm;
    return {
      version: 8,
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      sources: {
        'basemap-raster': {
          type: 'raster',
          tiles: bm.tiles,
          tileSize: 256,
          attribution: bm.attribution,
          maxzoom: 19,
        },
      },
      layers: [
        { id: 'basemap-raster', type: 'raster', source: 'basemap-raster' },
      ],
    };
  };

  // -------- State --------
  const state = {
    points: SAMPLE_POINTS,
    interactionMode: 'none',
    radius: { center: null, km: 2.0, marker: null },
    iso: {
      center: null,
      profile: 'motorcycle',
      minutes: 10,
      geojson: null,
      marker: null,
      loading: false,
    },
    route: {
      origin: null,
      dest: null,
      profile: 'car',
      originMarker: null,
      destMarker: null,
      lastRoute: null,
    },
    measure: {
      mode: 'length',
      points: [],
    },
    heatmap: { active: false },
    filters: { hospital: true, clinic: true, pharmacy: true },
    showMarkers: true,
    cluster: true,
    activeBasemap: 'carto-light',
    activeTool: 'markers',
  };

  // -------- DOM helpers --------
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const fmtKm = (km) =>
    km == null
      ? '—'
      : km < 1
        ? `${Math.round(km * 1000)} m`
        : `${km.toFixed(2)} km`;
  const fmtMin = (sec) => {
    if (sec == null) return '—';
    const total = Math.round(sec / 60);
    if (total < 60) return `${total} mnt`;
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${h} jam ${m} mnt`;
  };

  let toastTimer = null;
  const toast = (msg, ms = 2200) => {
    const el = $('#mapToast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), ms);
  };

  // -------- Map init --------
  const map = new maplibregl.Map({
    container: 'map',
    style: buildStyle(state.activeBasemap),
    center: CONFIG.center,
    zoom: CONFIG.zoom,
    fadeDuration: 0,
    attributionControl: { compact: true },
  });
  map.addControl(
    new maplibregl.NavigationControl({ visualizePitch: false }),
    'top-right',
  );
  map.addControl(
    new maplibregl.ScaleControl({ unit: 'metric' }),
    'bottom-left',
  );
  map.addControl(
    new maplibregl.GeolocateControl({
      trackUserLocation: false,
      showAccuracyCircle: false,
    }),
    'top-right',
  );

  // --- Circular flat icons (raster from inline SVG)
  // Base = lingkaran datar berwarna sesuai tipe, glyph putih di tengah:
  // cross (RS, merah), heart (klinik, oranye), capsule (apotek, hijau).
  // Anda bisa mengganti string `glyph` dengan markup SVG dari flaticon yang
  // sudah didownload (pakai fill="#fff" agar kontras dengan lingkaran).
  const PIN_DEFS = {
    'pin-hospital': {
      color: '#ef4444',
      glyph:
        '<rect x="10.4" y="6.6" width="3.2" height="10.8" rx="0.7" fill="#fff"/>' +
        '<rect x="6.6" y="10.4" width="10.8" height="3.2" rx="0.7" fill="#fff"/>',
    },
    'pin-clinic': {
      color: '#eab308',
      glyph:
        '<path fill="#fff" d="M12 16.6 C7.2 13.7 6.6 10.7 7.8 9 C9 7.4 11.1 7.8 12 9.4 C12.9 7.8 15 7.4 16.2 9 C17.4 10.7 16.8 13.7 12 16.6 Z"/>',
    },
    'pin-pharmacy': {
      color: '#10b981',
      glyph:
        '<g transform="translate(12 12) rotate(-35)">' +
        '<rect x="-5.4" y="-1.9" width="10.8" height="3.8" rx="1.9" fill="#fff"/>' +
        '<line x1="0" y1="-1.9" x2="0" y2="1.9" stroke="#10b981" stroke-width="0.6"/>' +
        '</g>',
    },
  };

  function createPinImage(def) {
    return new Promise((resolve) => {
      const w = 48,
        h = 48;
      const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24">` +
        `<circle cx="12" cy="12" r="10.2" fill="${def.color}" stroke="#ffffff" stroke-width="1.4"/>` +
        def.glyph +
        `</svg>`;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(ctx.getImageData(0, 0, w, h));
      };
      img.onerror = () => resolve(null);
      img.src =
        'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  }

  async function ensurePinImages() {
    for (const [name, def] of Object.entries(PIN_DEFS)) {
      if (map.hasImage(name)) continue;
      const img = await createPinImage(def);
      if (img && !map.hasImage(name)) map.addImage(name, img);
    }
  }

  function visibleFeatures() {
    return state.points.features.filter(
      (f) => state.filters[f.properties.type] !== false,
    );
  }

  function refreshPoints() {
    const fc = {
      type: 'FeatureCollection',
      features: visibleFeatures(),
    };
    map.getSource('points')?.setData(fc);
    updateVisibleStat();
    if (state.radius.center) updateRadiusResults();
    if (state.iso.geojson) updateIsochroneResults(state.iso.geojson);
  }

  function updateFilterCounts() {
    for (const t of Object.keys(state.filters)) {
      const n = state.points.features.filter(
        (f) => f.properties.type === t,
      ).length;
      const el = document.querySelector(`[data-count="${t}"]`);
      if (el) el.textContent = n;
    }
  }

  map.on('load', async () => {
    await ensurePinImages();
    addAllSourcesAndLayers();
    state.points.features.forEach(
      (f) =>
        (f.properties.cat =
          TYPE_META[f.properties.type]?.label ?? f.properties.type),
    );
    updateStats();
    updateFilterCounts();
    updateVisibleStat();
    bindMapInteractions();
  });

  map.on('moveend', updateVisibleStat);

  // Re-add overlays when style/basemap changes
  map.on('style.load', () => {
    if (!map.getSource('basemap-raster')) return;
    addAllSourcesAndLayers();
    if (state.heatmap.active) setHeatmapVisible(true);
    setMarkersVisible(state.showMarkers);
    if (state.radius.center) drawRadiusCircle();
    if (state.iso.geojson) drawIsochrone(state.iso.geojson);
    if (state.route.lastRoute) drawRouteLine(state.route.lastRoute);
    if (state.measure.points.length) updateMeasure();
    updateVisibleStat();
  });

  function addAllSourcesAndLayers() {
    const pointData = {
      type: 'FeatureCollection',
      features: visibleFeatures(),
    };
    if (!map.getSource('points')) {
      map.addSource('points', {
        type: 'geojson',
        data: pointData,
        cluster: state.cluster,
        clusterRadius: 50,
        clusterMaxZoom: 14,
      });
    } else {
      map.getSource('points').setData(pointData);
    }

    if (!map.getLayer('clusters')) {
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'points',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#10b981',
            5,
            '#84cc16',
            10,
            '#f59e0b',
            20,
            '#ef4444',
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            18,
            5,
            22,
            10,
            28,
            20,
            34,
          ],
        },
      });
    }
    if (!map.getLayer('cluster-count')) {
      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'points',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['Noto Sans Regular'],
          'text-size': 14,
        },
        paint: {
          'text-color': '#1f2937',
        },
      });
    }
    if (!map.getLayer('unclustered')) {
      map.addLayer({
        id: 'unclustered',
        type: 'symbol',
        source: 'points',
        filter: ['!', ['has', 'point_count']],
        layout: {
          'icon-image': [
            'match',
            ['get', 'type'],
            'hospital',
            'pin-hospital',
            'clinic',
            'pin-clinic',
            'pharmacy',
            'pin-pharmacy',
            'pin-pharmacy',
          ],
          'icon-size': 0.4,
          'icon-anchor': 'center',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
      });
    }
    // Heatmap layer (hidden by default)
    if (!map.getLayer('points-heat')) {
      map.addLayer(
        {
          id: 'points-heat',
          type: 'heatmap',
          source: 'points',
          maxzoom: 16,
          layout: { visibility: 'none' },
          paint: {
            'heatmap-weight': 1,
            'heatmap-intensity': 1,
            'heatmap-radius': 25,
            'heatmap-opacity': 0.85,
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0,
              'rgba(37, 99, 235, 0)',
              0.2,
              'rgba(37, 99, 235, 0.45)',
              0.4,
              'rgba(6, 182, 212, 0.65)',
              0.6,
              'rgba(132, 204, 22, 0.75)',
              0.8,
              'rgba(250, 204, 21, 0.85)',
              1,
              'rgba(239, 68, 68, 0.95)',
            ],
          },
        },
        'clusters',
      );
    }

    // Empty sources for analysis polygons + route
    if (!map.getSource('radius')) {
      map.addSource('radius', { type: 'geojson', data: emptyFC() });
      map.addLayer(
        {
          id: 'radius-fill',
          type: 'fill',
          source: 'radius',
          paint: { 'fill-color': '#f97316', 'fill-opacity': 0.12 },
        },
        'unclustered',
      );
      map.addLayer(
        {
          id: 'radius-line',
          type: 'line',
          source: 'radius',
          paint: {
            'line-color': '#f97316',
            'line-width': 2,
            'line-dasharray': [2, 2],
          },
        },
        'unclustered',
      );
    }
    if (!map.getSource('isochrone')) {
      map.addSource('isochrone', { type: 'geojson', data: emptyFC() });
      map.addLayer(
        {
          id: 'isochrone-fill',
          type: 'fill',
          source: 'isochrone',
          paint: { 'fill-color': '#8b5cf6', 'fill-opacity': 0.18 },
        },
        'unclustered',
      );
      map.addLayer(
        {
          id: 'isochrone-line',
          type: 'line',
          source: 'isochrone',
          paint: { 'line-color': '#8b5cf6', 'line-width': 2.5 },
        },
        'unclustered',
      );
    }
    if (!map.getSource('measure')) {
      map.addSource('measure', { type: 'geojson', data: emptyFC() });
      map.addLayer(
        {
          id: 'measure-fill',
          type: 'fill',
          source: 'measure',
          filter: ['==', ['get', 'kind'], 'polygon'],
          paint: { 'fill-color': '#06b6d4', 'fill-opacity': 0.18 },
        },
        'unclustered',
      );
      map.addLayer(
        {
          id: 'measure-line',
          type: 'line',
          source: 'measure',
          filter: ['==', ['get', 'kind'], 'line'],
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': '#0891b2',
            'line-width': 3,
            'line-dasharray': [1.5, 1.5],
          },
        },
        'unclustered',
      );
      map.addLayer({
        id: 'measure-points',
        type: 'circle',
        source: 'measure',
        filter: ['==', ['get', 'kind'], 'point'],
        paint: {
          'circle-color': '#0891b2',
          'circle-radius': 5,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2,
        },
      });
    }
    if (!map.getSource('route')) {
      map.addSource('route', { type: 'geojson', data: emptyFC() });
      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#1d4ed8',
          'line-width': 5,
          'line-opacity': 0.85,
        },
      });
      map.addLayer(
        {
          id: 'route-glow',
          type: 'line',
          source: 'route',
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 10,
            'line-opacity': 0.18,
          },
        },
        'route-line',
      );
    }
  }

  function emptyFC() {
    return { type: 'FeatureCollection', features: [] };
  }

  function setMarkersVisible(visible) {
    const v = visible ? 'visible' : 'none';
    ['unclustered', 'clusters', 'cluster-count'].forEach((id) => {
      if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', v);
    });
  }

  function setHeatmapVisible(visible) {
    state.heatmap.active = visible;
    if (!map.getLayer('points-heat')) return;
    map.setLayoutProperty(
      'points-heat',
      'visibility',
      visible ? 'visible' : 'none',
    );
  }

  // -------- Map interactions (popups, etc.) --------
  function bindMapInteractions() {
    map.on('click', 'unclustered', (e) => {
      // Saat sedang menentukan titik (radius/iso/measure/route-origin),
      // klik di atas marker tetap dipakai sebagai titik input — bukan popup.
      if (state.interactionMode !== 'none') return;
      const f = e.features?.[0];
      if (!f) return;
      openPopup(f);
    });

    map.on('click', 'clusters', async (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters'],
      });
      const clusterId = features[0].properties.cluster_id;
      const zoom = await map
        .getSource('points')
        .getClusterExpansionZoom(clusterId);
      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom,
      });
    });

    ['unclustered', 'clusters'].forEach((id) => {
      map.on(
        'mouseenter',
        id,
        () => (map.getCanvas().style.cursor = 'pointer'),
      );
      map.on('mouseleave', id, () => (map.getCanvas().style.cursor = ''));
    });

    // Single canvas-click handler routes by interaction mode
    map.on('click', (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['unclustered', 'clusters'],
      });
      // Saat tidak ada mode aktif, marker click sudah ditangani di atas.
      if (features.length && state.interactionMode === 'none') return;
      handleCanvasClick(e.lngLat);
    });
  }

  function openPopup(feature) {
    const p = feature.properties;
    const c = feature.geometry.coordinates;
    const meta = TYPE_META[p.type] ?? { color: '#6b7280', label: p.type };
    const html = `
      <div class="popup-title" style="color:${meta.color}">${escapeHtml(p.name)}</div>
      <div class="popup-meta">${meta.label}<br/>${escapeHtml(p.address || '')}</div>
      <div class="popup-actions">
        <button class="popup-route" data-lng="${c[0]}" data-lat="${c[1]}" data-name="${escapeHtml(p.name)}">Rute ke sini</button>
        <button class="alt popup-iso" data-lng="${c[0]}" data-lat="${c[1]}">Isochrone</button>
      </div>`;
    const popup = new maplibregl.Popup({
      offset: 14,
      anchor: 'bottom',
      closeButton: true,
    })
      .setLngLat(c)
      .setHTML(html)
      .addTo(map);

    setTimeout(() => {
      const btnRoute = popup.getElement().querySelector('.popup-route');
      const btnIso = popup.getElement().querySelector('.popup-iso');
      btnRoute?.addEventListener('click', (ev) => {
        const lng = +ev.currentTarget.dataset.lng;
        const lat = +ev.currentTarget.dataset.lat;
        const name = ev.currentTarget.dataset.name;
        switchTool('route');
        setRouteDestination([lng, lat], name);
        if (!state.route.origin) {
          toast(
            'Pilih titik asal terlebih dulu (klik "Set titik asal" / "Lokasi saya")',
          );
        } else {
          fetchAndRenderRoute();
        }
      });
      btnIso?.addEventListener('click', (ev) => {
        const lng = +ev.currentTarget.dataset.lng;
        const lat = +ev.currentTarget.dataset.lat;
        switchTool('isochrone');
        setIsochroneCenter([lng, lat]);
        runIsochrone();
      });
    }, 0);
  }

  function handleCanvasClick(lngLat) {
    const lnglat = [lngLat.lng, lngLat.lat];
    if (state.interactionMode === 'radius') {
      setRadiusCenter(lnglat);
    } else if (state.interactionMode === 'isochrone') {
      setIsochroneCenter(lnglat);
      runIsochrone();
    } else if (state.interactionMode === 'route-origin') {
      setRouteOrigin(lnglat);
      state.interactionMode = 'none';
      $('#setOrigin').classList.remove('armed');
      $('#setOrigin').textContent = 'Set titik asal';
      if (state.route.dest) fetchAndRenderRoute();
    } else if (state.interactionMode === 'measure') {
      state.measure.points.push(lnglat);
      updateMeasure();
    }
  }

  function escapeHtml(s) {
    return String(s ?? '').replace(
      /[&<>"']/g,
      (c) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        })[c],
    );
  }

  // -------- Stats --------
  function updateStats() {
    const total = state.points.features.length;
    $('#statTotal').textContent = total;
  }

  function updateVisibleStat() {
    const bounds = map.getBounds();
    let count = 0;
    for (const f of visibleFeatures()) {
      const [lng, lat] = f.geometry.coordinates;
      if (bounds.contains([lng, lat])) count++;
    }
    $('#statVisible').textContent = count;
  }

  // -------- Tools sidebar --------
  const TOOL_TOAST = {
    radius: 'Klik di peta untuk menentukan titik pusat radius',
    isochrone: 'Klik di peta untuk menentukan titik isochrone',
    route: 'Pilih titik asal lalu klik salah satu marker tujuan',
    measure: 'Klik di peta untuk menambah titik ukur',
  };
  const INTERACTION_FOR_TOOL = {
    radius: 'radius',
    isochrone: 'isochrone',
    measure: 'measure',
  };

  function switchTool(name) {
    state.activeTool = name;

    $$('.tool-tab').forEach((t) => {
      const isActive = t.dataset.tool === name;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      t.setAttribute('tabindex', isActive ? '0' : '-1');
    });
    $$('.panel').forEach((p) =>
      p.classList.toggle('hidden', p.id !== `panel-${name}`),
    );

    state.interactionMode = INTERACTION_FOR_TOOL[name] ?? 'none';
    map.getCanvas().style.cursor =
      state.interactionMode !== 'none' ? 'crosshair' : '';

    if (TOOL_TOAST[name]) toast(TOOL_TOAST[name]);
  }

  $$('.tool-tab').forEach((btn) => {
    btn.addEventListener('click', () => switchTool(btn.dataset.tool));
  });

  // -------- Markers panel --------
  $('#toggleMarkers').addEventListener('change', (e) => {
    state.showMarkers = e.target.checked;
    setMarkersVisible(state.showMarkers);
  });

  $$('input[data-filter]').forEach((cb) => {
    cb.addEventListener('change', () => {
      state.filters[cb.dataset.filter] = cb.checked;
      refreshPoints();
    });
  });

  // -------- Radius tool --------
  function setRadiusCenter(lnglat) {
    state.radius.center = lnglat;
    if (state.radius.marker) state.radius.marker.remove();
    const el = document.createElement('div');
    el.style.cssText =
      'width:18px;height:18px;border-radius:50%;background:#f97316;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3);';
    state.radius.marker = new maplibregl.Marker({ element: el })
      .setLngLat(lnglat)
      .addTo(map);
    drawRadiusCircle();
    updateRadiusResults();
  }

  function drawRadiusCircle() {
    if (!state.radius.center) return;
    const circle = turf.circle(state.radius.center, state.radius.km, {
      steps: 96,
      units: 'kilometers',
    });
    const src = map.getSource('radius');
    if (src) src.setData(circle);
  }

  function updateRadiusResults() {
    const c = state.radius.center;
    if (!c) {
      $('#radiusCount').textContent = '0';
      $('#radiusList').innerHTML = '';
      return;
    }
    const origin = turf.point(c);
    const inside = visibleFeatures()
      .map((f) => ({
        f,
        d: turf.distance(origin, turf.point(f.geometry.coordinates), {
          units: 'kilometers',
        }),
      }))
      .filter((x) => x.d <= state.radius.km)
      .sort((a, b) => a.d - b.d);
    $('#radiusCount').textContent = inside.length;
    $('#radiusKmText').textContent = state.radius.km.toFixed(1);
    $('#radiusList').innerHTML = inside
      .map(({ f, d }) => liItem(f, d))
      .join('');
    bindListClicks('#radiusList');
  }

  $('#radiusSlider').addEventListener('input', (e) => {
    state.radius.km = parseFloat(e.target.value);
    $('#radiusValue').textContent = state.radius.km.toFixed(1);
    drawRadiusCircle();
    updateRadiusResults();
  });
  $('#resetRadius').addEventListener('click', () => {
    state.radius.center = null;
    if (state.radius.marker) {
      state.radius.marker.remove();
      state.radius.marker = null;
    }
    map.getSource('radius')?.setData(emptyFC());
    updateRadiusResults();
  });

  function liItem(feature, distKm) {
    const p = feature.properties;
    const meta = TYPE_META[p.type] ?? { color: '#6b7280', label: p.type };
    return `<li data-lng="${feature.geometry.coordinates[0]}" data-lat="${feature.geometry.coordinates[1]}" data-id="${p.id}">
      <span class="li-dot" style="background:${meta.color}"></span>
      <div class="li-body">
        <div class="li-name">${escapeHtml(p.name)}</div>
        <div class="li-meta">${meta.label}</div>
      </div>
      <div class="li-dist">${fmtKm(distKm)}</div>
    </li>`;
  }

  function bindListClicks(sel) {
    $$(sel + ' li').forEach((li) => {
      li.addEventListener('click', () => {
        const lng = parseFloat(li.dataset.lng);
        const lat = parseFloat(li.dataset.lat);
        const id = parseInt(li.dataset.id, 10);
        const f = state.points.features.find((x) => x.properties.id === id);
        map.easeTo({ center: [lng, lat], zoom: Math.max(map.getZoom(), 14) });
        if (f) setTimeout(() => openPopup(f), 350);
      });
    });
  }

  // -------- Isochrone tool --------
  $$('#panel-isochrone .seg-btn').forEach((b) => {
    b.addEventListener('click', () => {
      $$('#panel-isochrone .seg-btn').forEach((x) =>
        x.classList.remove('active'),
      );
      b.classList.add('active');
      state.iso.profile = b.dataset.profile;
      if (state.iso.center) runIsochrone();
    });
  });
  $('#isoMinutes').addEventListener('input', (e) => {
    state.iso.minutes = parseInt(e.target.value, 10);
    $('#isoMinutesValue').textContent = state.iso.minutes;
    $('#isoMinText').textContent = state.iso.minutes;
  });
  $('#isoMinutes').addEventListener('change', () => {
    if (state.iso.center) runIsochrone();
  });
  $('#resetIso').addEventListener('click', () => {
    state.iso.center = null;
    state.iso.geojson = null;
    if (state.iso.marker) {
      state.iso.marker.remove();
      state.iso.marker = null;
    }
    map.getSource('isochrone')?.setData(emptyFC());
    $('#isoCount').textContent = '0';
    $('#isoList').innerHTML = '';
    $('#isoStatus').textContent = 'Belum ada titik dipilih.';
  });

  function setIsochroneCenter(lnglat) {
    state.iso.center = lnglat;
    if (state.iso.marker) state.iso.marker.remove();
    const el = document.createElement('div');
    el.style.cssText =
      'width:18px;height:18px;border-radius:50%;background:#8b5cf6;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3);';
    state.iso.marker = new maplibregl.Marker({ element: el })
      .setLngLat(lnglat)
      .addTo(map);
  }

  async function runIsochrone() {
    if (!state.iso.center) return;
    if (!CONFIG.mapidApiKey) {
      toast(
        'API key MapID belum di-set. Set lewat localStorage.MAPID_API_KEY atau Repository Secret.',
        4000,
      );
      $('#isoStatus').textContent = 'API key MapID belum di-set.';
      return;
    }
    const [lng, lat] = state.iso.center;
    $('#isoStatus').textContent = 'Memuat isochrone…';
    state.iso.loading = true;
    try {
      const url = `${CONFIG.mapidBaseUrl}/isochrone?key=${CONFIG.mapidApiKey}&point=${lat},${lng}&profile=${state.iso.profile}&time_limit=${state.iso.minutes * 60}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const poly = data.polygons?.[0] ?? data.features?.[0] ?? null;
      if (!poly) throw new Error('Empty polygon');
      state.iso.geojson = poly;
      drawIsochrone(poly);
      updateIsochroneResults(poly);
      $('#isoStatus').textContent =
        `Isochrone ${state.iso.minutes} menit (${state.iso.profile}).`;
    } catch (err) {
      console.error(err);
      $('#isoStatus').textContent =
        'Gagal memuat isochrone. Coba ubah moda / waktu.';
      toast('Gagal memuat isochrone — periksa koneksi atau API key.');
    } finally {
      state.iso.loading = false;
    }
  }

  function drawIsochrone(geojson) {
    const fc =
      geojson.type === 'FeatureCollection'
        ? geojson
        : { type: 'FeatureCollection', features: [geojson] };
    map.getSource('isochrone')?.setData(fc);
    try {
      const bbox = turf.bbox(fc);
      map.fitBounds(bbox, { padding: 60, duration: 600 });
    } catch {}
  }

  function updateIsochroneResults(geojson) {
    const poly =
      geojson.type === 'FeatureCollection' ? geojson.features[0] : geojson;
    if (!poly) {
      $('#isoCount').textContent = '0';
      $('#isoList').innerHTML = '';
      return;
    }
    const inside = visibleFeatures()
      .map((f) => ({
        f,
        d: turf.distance(
          turf.point(state.iso.center),
          turf.point(f.geometry.coordinates),
          { units: 'kilometers' },
        ),
      }))
      .filter(({ f }) => {
        try {
          return turf.booleanPointInPolygon(
            turf.point(f.geometry.coordinates),
            poly,
          );
        } catch {
          return false;
        }
      })
      .sort((a, b) => a.d - b.d);
    $('#isoCount').textContent = inside.length;
    $('#isoList').innerHTML = inside.map(({ f, d }) => liItem(f, d)).join('');
    bindListClicks('#isoList');
  }

  // -------- Heatmap tool --------
  $('#toggleHeatmap').addEventListener('change', (e) =>
    setHeatmapVisible(e.target.checked),
  );
  $('#heatRadius').addEventListener('input', (e) => {
    const v = parseInt(e.target.value, 10);
    $('#heatRadiusVal').textContent = v;
    if (map.getLayer('points-heat'))
      map.setPaintProperty('points-heat', 'heatmap-radius', v);
  });
  $('#heatIntensity').addEventListener('input', (e) => {
    const v = parseFloat(e.target.value);
    $('#heatIntVal').textContent = v.toFixed(1);
    if (map.getLayer('points-heat'))
      map.setPaintProperty('points-heat', 'heatmap-intensity', v);
  });

  // -------- Route tool --------
  $$('#panel-route .seg-btn').forEach((b) => {
    b.addEventListener('click', () => {
      $$('#panel-route .seg-btn').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
      state.route.profile = b.dataset.profile;
      if (state.route.origin && state.route.dest) fetchAndRenderRoute();
    });
  });

  $('#setOrigin').addEventListener('click', () => {
    state.interactionMode = 'route-origin';
    const btn = $('#setOrigin');
    btn.classList.add('armed');
    btn.textContent = 'Klik di peta untuk asal…';
    map.getCanvas().style.cursor = 'crosshair';
    toast('Klik di peta untuk menentukan titik asal');
  });

  $('#useGeolocation').addEventListener('click', () => {
    if (!navigator.geolocation) {
      toast('Browser tidak mendukung geolokasi');
      return;
    }
    toast('Mendeteksi lokasi…', 1500);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lnglat = [pos.coords.longitude, pos.coords.latitude];
        setRouteOrigin(lnglat, 'Lokasi saya');
        map.flyTo({ center: lnglat, zoom: 13 });
        if (state.route.dest) fetchAndRenderRoute();
      },
      () => toast('Gagal mendapatkan lokasi'),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  });

  $('#clearRoute').addEventListener('click', () => {
    state.route.origin = null;
    state.route.dest = null;
    state.route.lastRoute = null;
    if (state.route.originMarker) {
      state.route.originMarker.remove();
      state.route.originMarker = null;
    }
    if (state.route.destMarker) {
      state.route.destMarker.remove();
      state.route.destMarker = null;
    }
    map.getSource('route')?.setData(emptyFC());
    $('#routeOrigin').textContent = '–';
    $('#routeDest').textContent = '–';
    $('#routeDistance').textContent = '–';
    $('#routeDuration').textContent = '–';
  });

  function setRouteOrigin(lnglat, name) {
    state.route.origin = lnglat;
    if (state.route.originMarker) state.route.originMarker.remove();
    const el = document.createElement('div');
    el.style.cssText =
      'width:22px;height:22px;border-radius:50%;background:#1d4ed8;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.4);position:relative;';
    el.innerHTML =
      '<span style="position:absolute;top:-22px;left:50%;transform:translateX(-50%);font-size:10px;font-weight:700;background:#1d4ed8;color:#fff;padding:2px 6px;border-radius:6px;white-space:nowrap;">ASAL</span>';
    state.route.originMarker = new maplibregl.Marker({ element: el })
      .setLngLat(lnglat)
      .addTo(map);
    $('#routeOrigin').textContent =
      name || `${lnglat[1].toFixed(5)}, ${lnglat[0].toFixed(5)}`;
  }

  function setRouteDestination(lnglat, name) {
    state.route.dest = lnglat;
    if (state.route.destMarker) state.route.destMarker.remove();
    const el = document.createElement('div');
    el.style.cssText =
      'width:22px;height:22px;border-radius:50%;background:#dc2626;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.4);position:relative;';
    el.innerHTML =
      '<span style="position:absolute;top:-22px;left:50%;transform:translateX(-50%);font-size:10px;font-weight:700;background:#dc2626;color:#fff;padding:2px 6px;border-radius:6px;white-space:nowrap;">TUJUAN</span>';
    state.route.destMarker = new maplibregl.Marker({ element: el })
      .setLngLat(lnglat)
      .addTo(map);
    $('#routeDest').textContent =
      name || `${lnglat[1].toFixed(5)}, ${lnglat[0].toFixed(5)}`;
  }

  async function fetchAndRenderRoute() {
    if (!state.route.origin || !state.route.dest) return;
    const o = state.route.origin;
    const d = state.route.dest;
    const profile = state.route.profile;
    $('#routeDistance').textContent = '…';
    $('#routeDuration').textContent = '…';

    let result = null;

    // Primary: MapID routing (GraphHopper-style) — sama provider dengan isochrone
    try {
      const url =
        `${CONFIG.mapidBaseUrl}/route?key=${CONFIG.mapidApiKey}` +
        `&point=${o[1]},${o[0]}&point=${d[1]},${d[0]}` +
        `&profile=${profile}&type=json&points_encoded=false&instructions=false`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const path = data.paths?.[0];
        if (path && path.points) {
          result = {
            geometry: path.points,
            distance: path.distance,
            duration: (path.time ?? 0) / 1000,
          };
        }
      }
    } catch (err) {
      console.warn('MapID routing failed', err);
    }

    // Secondary: OSM Routing FOSSGIS (open-source OSRM, semua profil tersedia)
    // Endpoints: /routed-car, /routed-bike, /routed-foot — format respons OSRM standar.
    if (!result) {
      const osmProfile =
        profile === 'bike'
          ? 'routed-bike'
          : profile === 'foot'
            ? 'routed-foot'
            : 'routed-car';
      try {
        const url = `${CONFIG.osmRoutingBaseUrl}/${osmProfile}/route/v1/driving/${o[0]},${o[1]};${d[0]},${d[1]}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const route = data.routes?.[0];
          if (route) {
            result = {
              geometry: route.geometry,
              distance: route.distance,
              duration: route.duration,
            };
          }
        }
      } catch (err) {
        console.warn('OSM routing failed', err);
      }
    }

    // Tertiary: project-osrm.org (driving saja) — fallback terakhir untuk car
    if (!result && profile === 'car') {
      try {
        const url = `${CONFIG.osrmBaseUrl}/route/v1/driving/${o[0]},${o[1]};${d[0]},${d[1]}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const route = data.routes?.[0];
          if (route) {
            result = {
              geometry: route.geometry,
              distance: route.distance,
              duration: route.duration,
            };
          }
        }
      } catch (err) {
        console.warn('OSRM routing failed', err);
      }
    }

    if (result) {
      drawRouteLine(result.geometry);
      state.route.lastRoute = result.geometry;
      $('#routeDistance').textContent = fmtKm(result.distance / 1000);
      $('#routeDuration').textContent = fmtMin(result.duration);
      try {
        const bbox = turf.bbox(result.geometry);
        map.fitBounds(bbox, { padding: 80, duration: 700 });
      } catch {}
      return;
    }

    // Final fallback: haversine + asumsi kecepatan
    const km = turf.distance(turf.point(o), turf.point(d), {
      units: 'kilometers',
    });
    const speed = profile === 'foot' ? 4.5 : profile === 'bike' ? 15 : 35;
    const sec = (km / speed) * 3600;
    $('#routeDistance').textContent = fmtKm(km) + ' (lurus)';
    $('#routeDuration').textContent = '~' + fmtMin(sec);
    drawRouteLine({ type: 'LineString', coordinates: [o, d] });
    state.route.lastRoute = { type: 'LineString', coordinates: [o, d] };
    toast('Routing gagal, pakai estimasi garis lurus.');
  }

  function drawRouteLine(geometry) {
    const fc = {
      type: 'FeatureCollection',
      features: [{ type: 'Feature', properties: {}, geometry }],
    };
    map.getSource('route')?.setData(fc);
  }

  // -------- Measure tool --------
  $$('#panel-measure .seg-btn').forEach((b) => {
    b.addEventListener('click', () => {
      $$('#panel-measure .seg-btn').forEach((x) =>
        x.classList.remove('active'),
      );
      b.classList.add('active');
      state.measure.mode = b.dataset.measure;
      updateMeasure();
    });
  });

  $('#resetMeasure').addEventListener('click', () => {
    state.measure.points = [];
    map.getSource('measure')?.setData(emptyFC());
    updateMeasure();
  });

  function updateMeasure() {
    const pts = state.measure.points;
    const features = pts.map((p) => ({
      type: 'Feature',
      properties: { kind: 'point' },
      geometry: { type: 'Point', coordinates: p },
    }));

    let lengthKm = 0;
    let areaM2 = 0;

    if (state.measure.mode === 'length' && pts.length >= 2) {
      features.push({
        type: 'Feature',
        properties: { kind: 'line' },
        geometry: { type: 'LineString', coordinates: pts },
      });
      lengthKm = turf.length(turf.lineString(pts), { units: 'kilometers' });
    }

    if (state.measure.mode === 'area' && pts.length >= 2) {
      const ring = pts.length >= 3 ? [...pts, pts[0]] : pts;
      features.push({
        type: 'Feature',
        properties: { kind: 'line' },
        geometry: { type: 'LineString', coordinates: ring },
      });
      if (pts.length >= 3) {
        features.push({
          type: 'Feature',
          properties: { kind: 'polygon' },
          geometry: { type: 'Polygon', coordinates: [ring] },
        });
        areaM2 = turf.area(turf.polygon([ring]));
      }
    }

    map.getSource('measure')?.setData({
      type: 'FeatureCollection',
      features,
    });

    renderMeasureResult(lengthKm, areaM2);
  }

  function renderMeasureResult(lengthKm, areaM2) {
    const pts = state.measure.points;
    if (state.measure.mode === 'length') {
      $('#measureLabel').textContent = 'Panjang garis';
      if (lengthKm < 1) {
        $('#measureValue').textContent = (lengthKm * 1000).toFixed(1);
        $('#measureUnit').textContent = 'm';
      } else {
        $('#measureValue').textContent = lengthKm.toFixed(2);
        $('#measureUnit').textContent = 'km';
      }
      $('#measureHint').textContent =
        pts.length === 0
          ? 'Klik di peta untuk titik pertama.'
          : pts.length === 1
            ? 'Klik titik berikutnya untuk mulai mengukur.'
            : `${pts.length} titik — klik untuk menambah segmen.`;
    } else {
      $('#measureLabel').textContent = 'Luas area';
      if (areaM2 < 1e6) {
        $('#measureValue').textContent = areaM2.toFixed(0);
        $('#measureUnit').textContent = 'm²';
      } else {
        $('#measureValue').textContent = (areaM2 / 1e6).toFixed(2);
        $('#measureUnit').textContent = 'km²';
      }
      $('#measureHint').textContent =
        pts.length < 3
          ? `Butuh minimal 3 titik (sekarang ${pts.length}).`
          : `${pts.length} titik — klik untuk memperluas poligon.`;
    }
  }

  // -------- Search (Nominatim) --------
  async function doSearch() {
    const q = $('#searchInput').value.trim();
    if (!q) return;
    try {
      toast('Mencari…', 1200);
      const res = await fetch(
        `${CONFIG.nominatimBaseUrl}/search?q=${encodeURIComponent(q)}&format=json&limit=1&accept-language=id`,
        { headers: { 'Accept-Language': 'id' } },
      );
      const arr = await res.json();
      if (!arr[0]) {
        toast('Lokasi tidak ditemukan');
        return;
      }
      const lat = parseFloat(arr[0].lat);
      const lng = parseFloat(arr[0].lon);
      map.flyTo({ center: [lng, lat], zoom: 14, speed: 1.2 });
    } catch {
      toast('Pencarian gagal');
    }
  }
  $('#searchBtn').addEventListener('click', doSearch);
  $('#searchInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });

  // -------- Basemap switcher --------
  // Swap basemap in-place agar source/layer custom (points, radius, iso, route,
  // measure) tidak ikut hilang. setStyle() akan mereset seluruh style.
  function setBasemap(key) {
    const bm = BASEMAPS[key] || BASEMAPS.osm;
    state.activeBasemap = key;

    // Cari layer non-basemap pertama agar basemap tetap di paling bawah
    const layers = map.getStyle().layers || [];
    let beforeId = null;
    for (const l of layers) {
      if (l.id !== 'basemap-raster') {
        beforeId = l.id;
        break;
      }
    }

    if (map.getLayer('basemap-raster')) map.removeLayer('basemap-raster');
    if (map.getSource('basemap-raster')) map.removeSource('basemap-raster');

    map.addSource('basemap-raster', {
      type: 'raster',
      tiles: bm.tiles,
      tileSize: 256,
      attribution: bm.attribution,
      maxzoom: 19,
    });
    map.addLayer(
      { id: 'basemap-raster', type: 'raster', source: 'basemap-raster' },
      beforeId,
    );
  }

  $$('.bm').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.bm').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      setBasemap(btn.dataset.bm);
    });
  });

  // -------- Sidebar toggle (mobile) --------
  $('#sidebarToggle').addEventListener('click', () => {
    $('#sidebar').classList.toggle('collapsed');
  });

  // Close sidebar by tapping outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth > 768) return;
    const sb = $('#sidebar');
    const tg = $('#sidebarToggle');
    if (
      !sb.contains(e.target) &&
      !tg.contains(e.target) &&
      !sb.classList.contains('collapsed')
    ) {
      sb.classList.add('collapsed');
    }
  });
})();
