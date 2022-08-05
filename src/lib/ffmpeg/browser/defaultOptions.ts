export default {
  corePath: typeof process !== 'undefined' && process.env.NODE_ENV === 'development'
    ? new URL('/node_modules/@ffmpeg/core/dist/ffmpeg-core.js', window.location.href).href
    : `https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js`,
}
