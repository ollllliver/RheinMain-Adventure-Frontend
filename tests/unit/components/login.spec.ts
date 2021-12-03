import { shallowMount } from "@vue/test-utils";
import Login from '@/components/Login.vue'
import user from '@/stores/user'
describe('compontens/Login.vue Test', () => {
    it('rendert Komponente', () => {
        const wrapper = shallowMount(Login)
        expect(wrapper).toBeTruthy(); 
    })
    it('Login Formular abschicken mit gültigen Daten', () => {
        const wrapper = shallowMount(Login)
        expect(wrapper).toBeTruthy(); 
    })
})