import { useState } from "react";
import { Link } from "react-router-dom";

require("./Document.css");


export default function Document() {
    let [choiceIndex, changeIndex] = useState(0)

    const onChoiceIndex = (e: any) => {
        console.log(e)
        changeIndex(e)
    }

    const targetUrl = (url: any)=> {
        console.log('target', url)
        window.open(url)
    }

    const showArticle = () => {
        switch (choiceIndex) {
            case 0: 
                return <div className="img_box">
                    <img src={require('../../static/image/article1.png')} alt="" />
                </div>
            case 1: 
            return <div className="img_box">
                    <img src={require('../../static/image/article2.png')} alt="" />
                </div>
            case 2: 
            return <div className="img_box">
                    <img src={require('../../static/image/article3.png')} alt="" />
                </div>
            case 3: 
            return <div className="img_box">
                    <img src={require('../../static/image/article4.png')} alt="" />
                </div>
            case 4: 
            return <div className="img_box">
                    <img src={require('../../static/image/article5.png')} alt="" />
                </div>
            case 5: 
            return <div className="img_box">
                    <img src={require('../../static/image/article6.png')} alt="" />
                </div>
            case 6: 
            return <div className="img_box">
                    <img src={require('../../static/image/article7.png')} alt="" />
                </div>
            case 7: 
            return <div className="img_box">
                    <img src={require('../../static/image/article8.png')} style={{marginBottom: '60px'}} alt="" />
                    {/* Twitter: https://twitter.com/TetriSolBuilder​
                    Telegram: https://t.me/TetriSolBuilder​
                    Dapp: Tetrisol.net */}
                    <div className="link_url" onClick={Event => targetUrl('https://twitter.com/TetrisSol')}>
                        Twitter: https://twitter.com/TetrisSol
                    </div>

                    <div className="link_url" onClick={Event => targetUrl('https://t.me/TetrisSol')}>
                        Telegram: https://t.me/TetrisSol
                    </div>

                    <div className="link_url" onClick={Event => targetUrl('https://www.tetrisol.net')}>
                        Dapp: Tetrisol.net
                    </div>
                </div>
            default:
                break;
        }
    }

    return (
      <div className="doc_box flex_column align_center">
        <div className="logo_box flex align_center">
            <img src={require('../../static/image/logo.png')} alt="" />
            <Link className="list-group-item" to="/home">TetriSol</Link>
        </div>

        <div className="cont_box">
            <div className="left_tab_box">
                <div className={choiceIndex === 0 ? 'tab_box choice_box' : 'tab_box'} onClick={Event => onChoiceIndex(0)}>
                    Project Introduction
                </div>

                <div className={choiceIndex === 1 ? 'tab_box choice_box' : 'tab_box'} onClick={Event => onChoiceIndex(1)}>
                    Phase S
                </div>

                <div className={choiceIndex === 2 ? 'tab_box choice_box' : 'tab_box'} onClick={Event => onChoiceIndex(2)}>
                    Phase O
                </div>
                
                <div className={choiceIndex === 3 ? 'tab_box choice_box' : 'tab_box'} onClick={Event => onChoiceIndex(3)}>
                    Phase L
                </div>
                
                <div className={choiceIndex === 4 ? 'tab_box choice_box' : 'tab_box'} onClick={Event => onChoiceIndex(4)}>
                    Phase Z
                </div>

                <div className={choiceIndex === 5 ? 'tab_box choice_box' : 'tab_box'} onClick={Event => onChoiceIndex(5)}>
                    Road Map
                </div>

                <div className={choiceIndex === 6 ? 'tab_box choice_box' : 'tab_box'} onClick={Event => onChoiceIndex(6)}>
                    Risk  and Disclaimer
                </div>

                <div className={choiceIndex === 7 ? 'tab_box choice_box' : 'tab_box'} onClick={Event => onChoiceIndex(7)}>
                    Official Links
                </div>
            </div>

            <div className="right_box">
                {
                   showArticle()
                }
            </div>
        </div>
      </div>
    );
}