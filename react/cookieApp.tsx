import React, { useEffect, useState } from 'react';
import { /*Layout, PageBlock, Box,*/ Spinner, Button } from 'vtex.styleguide';
import getRandomFortuneCookie from "./graphql/getRandomFortuneCookie.gql";
import { useCssHandles } from 'vtex.css-handles';
import { useLazyQuery } from 'react-apollo';

const CSS_HANDLES = [
    'div_container',
    'div_btn_phrase',
    'div_relleno',
    'div_result',
    'div_result_content',
    'phraseH3',
    'span1'
]

const cookieApp = () => {

    const handles = useCssHandles(CSS_HANDLES)

    const [phrase, setPhrase] = useState('')
    const [luckyNumber, setLuckyNumber] = useState('')

    const [queryGet, { data, loading }] = useLazyQuery(getRandomFortuneCookie, { fetchPolicy: 'network-only', notifyOnNetworkStatusChange: true })

    const handleButton: any = () => {
        queryGet()
        setPhrase((prevstate) => data ? data.getRandomFortuneCookie.text : prevstate)
        const randomNumber = () => {
            let random = Math.floor((Math.random() * 98) + 1).toString()
            return random.length > 1 ? random : `0${random}`
        }
        setLuckyNumber(`${randomNumber()} - ${randomNumber()} - ${randomNumber()} - ${randomNumber()}`)
    }

    useEffect(() => {
        queryGet()
    }, [])


    return (
        <>
            <div className={`${handles.div_container}`}>
                {
                    loading ? <Spinner /> :
                        <div className={handles.div_btn_phrase}>
                            <Button onClick={() => handleButton()}>Get your fortune cookie</Button>
                            <div className={handles.div_relleno}></div>
                        </div>
                }
                <div className={handles.div_result}>
                    {
                        phrase && luckyNumber && data &&
                        <div className={handles.div_result_content}>
                            <h3 className={handles.phraseH3}>{phrase}</h3>
                            <p className={handles.span1}>Your fortune number is: {luckyNumber}</p>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default cookieApp