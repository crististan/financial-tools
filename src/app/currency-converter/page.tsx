'use client';

import type { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import Section from "@/components/section";
import Container from "@/components/container";
import Hero from "@/components/hero";
import CurrencyInput from '@/components/tools/currency-converter/currency-input';

export default function CurrencyConverter() {
    const currencies = [
        { code: 'usd', name: 'USD - US Dollar'},
        { code: 'eur', name: 'EUR - Euro'},
        { code: 'gbp', name: 'GBP - British Pound'},
        { code: 'jpy', name: 'JPY - Japanese Yen'},
        { code: 'aud', name: 'AUD - Australian Dollar'},
        { code: 'cad', name: 'CAD - Canadian Dollar'},
        { code: 'chf', name: 'CHF - Swiss Franc'},
        { code: 'cny', name: 'CNY - Chinese Yuan'},
        { code: 'sek', name: 'SEK - Swedish Krona'},
        { code: 'nzd', name: 'NZD - New Zealand Dollar'}
    ];

    const [amount, setAmount] = useState(0);
    const [from, setFrom] = useState(currencies[0].code);
    const [to, setTo] = useState(currencies[1].code);
    const [result, setResult] = useState(0);

    function changeAmount(e: ChangeEvent<HTMLInputElement>) {
        setAmount(parseFloat(e.target.value));
    }

    function changeCurrency(e: ChangeEvent<HTMLSelectElement>, type: 'from' | 'to') {
        if (type === 'from') {
            setFrom(e.target.value);
        } else {
            setTo(e.target.value);
        }
    }

    useEffect(() => {
        setResult(amount * 1.2);

        console.log(`Convert ${amount} from ${from} to ${to}.`);
    }, [amount, from, to]);

    return (
        <>
            <Hero
                headline="Currency converter"
                description="Convert currencies quickly and reliably with up-to-date exchange rates."
            />
            <Section>
                <Container>
                    <div className="w-full max-w-[320px] mx-auto bg-[var(--clr-neutral-1000)] border-1 border-[var(--clr-neutral-900)] rounded-lg p-1">
                        <form>
                            <CurrencyInput
                                label="From"
                                value={amount}
                                currencies={currencies}
                                selectedCurrency={from}
                                onChangeInput={changeAmount}
                                onChangeSelect={(e) => changeCurrency(e, 'from')}
                            />
                            <div className="my-1 bg-[var(--clr-neutral-800)]"></div>
                            <CurrencyInput
                                label="To"
                                value={result}
                                currencies={currencies}
                                selectedCurrency={to}
                                isReadOnly={true}
                                onChangeSelect={(e) => changeCurrency(e, 'to')}
                            />
                        </form>
                    </div>
                </Container>
            </Section>
        </>
    );
}