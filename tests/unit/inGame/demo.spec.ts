import { mount } from '@vue/test-utils'
import Spieleumgebung from '@/components/inGame/Spieleumgebung.vue'
import Pause from '@/components/inGame/Pause.vue'


describe('Spieleumgebung', () => {
  test('rendert Pause Komponente', async () => {
    const wrapper = mount(Spieleumgebung)

    expect(wrapper.findComponent(Pause)).toBeTruthy()

  })
})