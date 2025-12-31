import React, { useState } from 'react';
import PointCharge from '../components/PointCharge';
import BgmShop from '../components/BgmShop';
import './BgmStorePage.css';

const BgmStorePage = () => {
    const [activeTab, setActiveTab] = useState('shop'); // 'shop' or 'charge'

    const handleChargeSuccess = () => {
        // 충전 완료 후 상점 탭으로 이동
        setActiveTab('shop');
    };

    const handlePurchaseSuccess = () => {
        // BGM 구매 완료 후 새로고침 (이미 BgmShop 컴포넌트 내부에서 처리)
    };

    return (
        <div className="bgm-store-page">
            <div className="store-header">
                <h1>🎵 BGM 스토어</h1>
                <p>나만의 BGM을 구매하여 미니홈피를 꾸며보세요!</p>
            </div>

            <div className="tab-menu">
                <button 
                    className={`tab-btn ${activeTab === 'shop' ? 'active' : ''}`}
                    onClick={() => setActiveTab('shop')}
                >
                    BGM 상점
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'charge' ? 'active' : ''}`}
                    onClick={() => setActiveTab('charge')}
                >
                    포인트 충전
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'shop' && (
                    <BgmShop onPurchaseSuccess={handlePurchaseSuccess} />
                )}
                {activeTab === 'charge' && (
                    <PointCharge onChargeSuccess={handleChargeSuccess} />
                )}
            </div>
        </div>
    );
};

export default BgmStorePage;
