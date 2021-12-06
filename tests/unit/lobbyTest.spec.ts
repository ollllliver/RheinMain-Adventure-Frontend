import { mount } from '@vue/test-utils'
import LobbyView from '@/views/LobbyView.vue'
import Chat from '@/components/lobby/Chat.vue'
import Einstellungen from '@/components/lobby/Einstellungen.vue'
import InviteCopy from '@/components/lobby/InviteCopy.vue'
import Teilnehmerliste from '@/components/lobby/Teilnehmerliste.vue'

describe('Test LobbyView.vue', () => {
  test('Lobby erstellen', async () => {
    const wrapper = mount(LobbyView)

    expect(wrapper.findComponent(Chat)).toBeTruthy()
    expect(wrapper.findComponent(Einstellungen)).toBeTruthy()
    expect(wrapper.findComponent(InviteCopy)).toBeTruthy()
    expect(wrapper.findComponent(Teilnehmerliste)).toBeTruthy()

  })
})