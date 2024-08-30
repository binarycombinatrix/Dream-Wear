import { useState } from 'react'
import { Logo } from '@pmndrs/branding'
import { motion, AnimatePresence } from 'framer-motion'
import { AiFillCamera, AiOutlineArrowLeft, AiOutlineHighlight, AiOutlineShopping } from 'react-icons/ai'
import { useSnapshot } from 'valtio'
import { state } from './store'
import { Client } from '@gradio/client'
export function Overlay() {
  const snap = useSnapshot(state)
  const transition = { type: 'spring', duration: 0.8 }
  const config = {
    initial: { x: -100, opacity: 0, transition: { ...transition, delay: 0.5 } },
    animate: { x: 0, opacity: 1, transition: { ...transition, delay: 0 } },
    exit: { x: -100, opacity: 0, transition: { ...transition, delay: 0 } }
  }
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      <motion.header initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
        <Logo width="40" height="40" />
        <motion.div animate={{ x: snap.intro ? 0 : 100, opacity: snap.intro ? 1 : 0 }} transition={transition}>
          <AiOutlineShopping size="3em" />
        </motion.div>
      </motion.header>
      <AnimatePresence>
        {snap.intro ? (
          // <motion.section key="main" {...config}>
          <div className="section--container">
            <div>
              <motion.div
                key="title"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 5, stiffness: 40, restDelta: 0.001, duration: 0.3 }}>
                <h1>Dream wear</h1>
              </motion.div>
            </div>
            <div className="support--content">
              <motion.div
                key="p"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: 'spring',
                  damping: 7,
                  stiffness: 30,
                  restDelta: 0.001,
                  duration: 0.6,
                  delay: 0.2,
                  delayChildren: 0.2
                }}>
                <button style={{ background: snap.color, border: 'solid 3px #000' }} onClick={() => (state.intro = false)}>
                  <strong>
                    CUSTOMIZE IT <AiOutlineHighlight size="1.3em" />
                  </strong>
                </button>
                <p>
                  Create your unique and exclusive shirt with our brand-new 3D customization tool. <strong>Unleash your imagination</strong> and define your own
                  style.
                </p>
              </motion.div>
            </div>
          </div>
        ) : (
          // </motion.section>
          <motion.section key="custom" {...config}>
            <Customizer />
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}

function Customizer() {
  const snap = useSnapshot(state)
  const [genAIprompt, setGenAIprompt] = useState('')
  const [showPropmt, setShowPrompt] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const genImage = async () => {
    setShowLoader(true)
    console.log('generating image')
    let bgColor = '#FFFFFF'

    switch (snap.color) {
      case '#ccc':
        bgColor = 'gray'
        break
      case '#EFBD4E':
        bgColor = 'yellow'
        break
      case '#80C670':
        bgColor = 'light and bright green colored'
        break
      case '#726DE8':
        bgColor = 'light and bright purple colored'
        break
      case '#EF674E':
        bgColor = 'peach-red'
        break
      case '#353934':
        bgColor = 'black'
        break
    }

    try {
      const client = await Client.connect('black-forest-labs/FLUX.1-schnell')
      const result = await client.predict('/infer', {
        prompt: `full shot, centered, 3d photorealistic highly detailed image, plain ${bgColor} background, ${genAIprompt}`,
        seed: 0,
        randomize_seed: true,
        width: 1024,
        height: 1400,
        num_inference_steps: 1
      })

      console.log('flux result', result)
      if (result?.data?.[0]?.url) {
        state.decal = result.data[0].url
        setShowPrompt(false)
      }

      setShowLoader(false)
    } catch (error) {
      setShowLoader(false)
      console.log('error', error)
      alert('Error generating image, please try again')
    }
  }
  return (
    <>
      {showLoader && (
        <div className="loader">
          <img src="Dream-Wear/loader.gif" alt="Loading" />
        </div>
      )}
      <div className="customizer">
        <div className="color-options">
          {snap.colors.map((color) => (
            <div key={color} className={`circle`} style={{ background: color }} onClick={() => (state.color = color)}></div>
          ))}
        </div>
        <div className="decals">
          <div className="decals--container">
            {snap.decals.map((decal) => (
              <div key={decal} className={`decal`} onClick={() => (state.decal = decal)}>
                <img src={decal.split('.')[0] + '_thumb.png'} alt="brand" />
              </div>
            ))}
          </div>
        </div>

        {showPropmt ? (
          <div className="prompt-input">
            <textarea type="text" value={genAIprompt} onChange={(e) => setGenAIprompt(e.target.value)} />
            <button style={{ background: snap.color }} onClick={genImage}>
              Create
            </button>
          </div>
        ) : (
          <div className="prompt-input">
            <button
              // className="zoom"
              onClick={() => {
                setShowPrompt(true)
              }}>
              AI <AiFillCamera size="1.3em" />
            </button>
          </div>
        )}
        <button
          className="share"
          style={{ background: snap.color }}
          onClick={() => {
            const link = document.createElement('a')
            link.setAttribute('download', 'canvas.png')
            link.setAttribute('href', document.querySelector('canvas').toDataURL('image/png').replace('image/png', 'image/octet-stream'))
            link.click()
          }}>
          DOWNLOAD
          <AiFillCamera size="1.3em" />
        </button>
        <button className="exit" style={{ background: snap.color }} onClick={() => (state.intro = true)}>
          GO BACK
          <AiOutlineArrowLeft size="1.3em" />
        </button>
      </div>
    </>
  )
}
