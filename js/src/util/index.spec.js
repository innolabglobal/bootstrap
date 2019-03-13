import * as Util from './index'

/** Test helpers */
import { getFixture, clearFixture } from '../../tests/helpers/fixture'

describe('Util', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('getUID', () => {
    it('should generate uid', () => {
      const uid = Util.getUID('bs')
      const uid2 = Util.getUID('bs')

      expect(uid).not.toEqual(uid2)
    })
  })

  describe('getSelectorFromElement', () => {
    it('should get selector from data-target', () => {
      fixtureEl.innerHTML = [
        '<div id="test" data-target=".target"></div>',
        '<div class="target"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(Util.getSelectorFromElement(testEl)).toEqual('.target')
    })

    it('should get selector from href if no data-target set', () => {
      fixtureEl.innerHTML = [
        '<a id="test" href=".target"></a>',
        '<div class="target"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(Util.getSelectorFromElement(testEl)).toEqual('.target')
    })

    it('should get selector from href if data-target equal to #', () => {
      fixtureEl.innerHTML = [
        '<a id="test" data-target="#" href=".target"></a>',
        '<div class="target"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(Util.getSelectorFromElement(testEl)).toEqual('.target')
    })

    it('should return null if selector not found', () => {
      fixtureEl.innerHTML = '<a id="test" href=".target"></a>'

      const testEl = fixtureEl.querySelector('#test')

      expect(Util.getSelectorFromElement(testEl)).toBeNull()
    })
  })

  describe('getTransitionDurationFromElement', () => {
    it('should get transition from element', () => {
      fixtureEl.innerHTML = '<div style="transition: all 300ms ease-out;"></div>'

      expect(Util.getTransitionDurationFromElement(fixtureEl.querySelector('div'))).toEqual(300)
    })

    it('should return 0 if the element is undefined or null', () => {
      expect(Util.getTransitionDurationFromElement(null)).toEqual(0)
      expect(Util.getTransitionDurationFromElement(undefined)).toEqual(0)
    })

    it('should return 0 if the element do not possess transition', () => {
      fixtureEl.innerHTML = '<div></div>'

      expect(Util.getTransitionDurationFromElement(fixtureEl.querySelector('div'))).toEqual(0)
    })
  })

  describe('triggerTransitionEnd', () => {
    it('should trigger transitionend event', done => {
      fixtureEl.innerHTML = '<div style="transition: all 300ms ease-out;"></div>'

      const el = fixtureEl.querySelector('div')

      el.addEventListener('transitionend', () => {
        expect().nothing()
        done()
      })

      Util.triggerTransitionEnd(el)
    })
  })

  describe('isElement', () => {
    it('should detect if the parameter is an element or not', () => {
      fixtureEl.innerHTML = '<div></div>'

      const el = document.querySelector('div')

      expect(Util.isElement(el)).toEqual(el.nodeType)
      expect(Util.isElement({})).toEqual(undefined)
    })

    it('should detect jQuery element', () => {
      fixtureEl.innerHTML = '<div></div>'

      const el = document.querySelector('div')
      const fakejQuery = {
        0: el
      }

      expect(Util.isElement(fakejQuery)).toEqual(el.nodeType)
    })
  })

  describe('emulateTransitionEnd', () => {
    it('should emulate transition end', () => {
      fixtureEl.innerHTML = '<div></div>'

      const el = document.querySelector('div')
      const spy = spyOn(window, 'setTimeout')

      Util.emulateTransitionEnd(el, 10)
      expect(spy).toHaveBeenCalled()
    })

    it('should not emulate transition end if already triggered', done => {
      fixtureEl.innerHTML = '<div></div>'

      const el = fixtureEl.querySelector('div')
      const spy = spyOn(el, 'removeEventListener')

      Util.emulateTransitionEnd(el, 10)
      Util.triggerTransitionEnd(el)

      setTimeout(() => {
        expect(spy).toHaveBeenCalled()
        done()
      }, 20)
    })
  })

  describe('typeCheckConfig', () => {
    it('should check type of the config object', () => {
      const namePlugin = 'collapse'
      const defaultType = {
        toggle: 'boolean',
        parent: '(string|element)'
      }
      const config = {
        toggle: true,
        parent: 777
      }

      expect(() => {
        Util.typeCheckConfig(namePlugin, config, defaultType)
      }).toThrow(new Error('COLLAPSE: Option "parent" provided type "number" but expected type "(string|element)".'))
    })
  })
})
