import { Application as AppR, extend } from "@pixi/react"
import { Application as AppN, Assets, Container, Sprite, Graphics} from 'pixi.js'


extend({
  Container,
  Graphics,
  Sprite,
});


function App() {

  return (
    <AppR backgroundColor={"#922724"} resizeTo={window}>
      
    </AppR>
  )
}

export default App;