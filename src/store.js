import { proxy } from 'valtio'

const state = proxy({
  intro: true,
  colors: ['#ccc', '#EFBD4E', '#80C670', '#726DE8', '#EF674E', '#353934'],
  decals: ['/Dream-Wear/react', '/Dream-Wear/three2', '/Dream-Wear/pmndrs'],
  color: '#EFBD4E',
  decal: '/Dream-Wear/three2'
})

export { state }
