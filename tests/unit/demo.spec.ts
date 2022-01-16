import { mount } from '@vue/test-utils'
import Demo from '@/components/inGame/Demo.vue'
import Pause from '@/components/inGame/Pause.vue'


describe('Demo', () => {
  test('rendert Pause Komponente', async () => {
    const wrapper = mount(Demo)

    expect(wrapper.findComponent(Pause)).toBeTruthy()

  })
})