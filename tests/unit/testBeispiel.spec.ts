import { mount } from '@vue/test-utils'
import TestBeispiel from '@/components/TestBeispiel.vue'

test('creates a todo', async () => {
  const wrapper = mount(TestBeispiel)

  await wrapper.get('[data-test="new-todo"]').setValue('New todo')
  await wrapper.get('[data-test="form"]').trigger('submit')

  expect(wrapper.findAll('[data-test="todo"]')).toHaveLength(2)
})