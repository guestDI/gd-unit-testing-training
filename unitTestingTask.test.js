import unitTestingTask from './unitTestingTask'
import { tokenMocks } from './__fixtures__/mocks'

const formatError = 'Argument `format` must be a string'
const dateError = 'Argument `date` must be instance of Date or Unix Timestamp or ISODate String'
const enToken = 'en'

describe('Date formats', () => {
    beforeAll(() => {
        jest
            .useFakeTimers()
            .setSystemTime(new Date(1661767962000))
    })
    
    afterAll(() => {
        jest.useRealTimers()
    })

    it('should return current date based on formatter', () => {
        expect(unitTestingTask('ISODate')).toBe('2022-08-29')
    })

    it('should return custom date based on formatter', () => {
        expect(unitTestingTask('ISODate', '2022-07-20T00:00:00')).toBe('2022-07-20')
    })

    it('should throw an error if format is undefined', () => {
        expect(() => { unitTestingTask(undefined, new Date()) }).toThrow(new TypeError(formatError));
    })

    it('should throw an error if date param is passed as null', () => {
        expect(() => { unitTestingTask('MM', null) }).toThrow(new TypeError(dateError));
    })

    it('should return default formatters', () => {
        expect(unitTestingTask.formatters()).toStrictEqual(['ISODate', 'ISOTime', 'ISODateTime', 'ISODateTimeTZ'])
    })

    it('should create custom formatter', () => {
        unitTestingTask.register('CustomFormatter', 'YYYY-MM')
        expect(unitTestingTask.formatters()).toStrictEqual(['ISODate', 'ISOTime', 'ISODateTime', 'ISODateTimeTZ', 'CustomFormatter'])
    })

    describe('tokens', () => {
        tokenMocks.forEach(({token, value}) => {
            it(`should return date in required format: ${token}`, () => {
                expect(unitTestingTask(token, new Date())).toBe(value)
            })
        })
    })

    describe('languages', () => {
        it('should return default language if no language provided', () => {
            expect(unitTestingTask.lang()).toBe(enToken)
        })

        it('should return default language if no options', () => {
            expect(unitTestingTask.lang('de')).toBe(enToken)
        })

        it('should return correct meridiem in lowerCase for time after 11', () => {
            expect(unitTestingTask._languages[enToken].meridiem(12, true)).toBe('pm')
        })

        it('should return correct meridiem in upperCase for time after 11', () => {
            expect(unitTestingTask._languages[enToken].meridiem(12, false)).toBe('PM')
        })

        it('should return correct meridiem in upperCase for time before 11', () => {
            expect(unitTestingTask._languages[enToken].meridiem(10, false)).toBe('AM')
        })

        it('should return correct meridiem in the lowerCase for time before 11', () => {
            expect(unitTestingTask._languages[enToken].meridiem(10, true)).toBe('am')
        })

        it('should return correct language different from default one', () => {
            unitTestingTask.lang('pl', {})
            expect(unitTestingTask.lang(enToken)).toBe(enToken)
        })
    })
})
