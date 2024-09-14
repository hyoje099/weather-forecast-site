document.getElementById('getWeather').addEventListener('click', function() {
    const location = document.getElementById('location').value;
    
    if (!location) {
        alert('지역을 선택해주세요.');
        return;
    }

    // 지역별 좌표 설정 (예시 좌표로 실제 API 호출 시 필요한 좌표로 대체해야 함)
    const locationCoordinates = {
        '서울': { nx: 60, ny: 127 },
        '부산': { nx: 98, ny: 76 },
        '대구': { nx: 89, ny: 90 },
        '인천': { nx: 55, ny: 124 },
        '광주': { nx: 58, ny: 74 },
        '대전': { nx: 67, ny: 100 },
        '울산': { nx: 102, ny: 84 },
        '세종': { nx: 66, ny: 103 },
        '경기': { nx: 60, ny: 120 },
        '강원': { nx: 73, ny: 134 },
        '충북': { nx: 69, ny: 107 },
        '충남': { nx: 68, ny: 100 },
        '전북': { nx: 63, ny: 89 },
        '전남': { nx: 50, ny: 67 },
        '경북': { nx: 89, ny: 91 },
        '경남': { nx: 91, ny: 77 },
        '제주': { nx: 52, ny: 38 }
    };

    const coords = locationCoordinates[location];
    if (!coords) {
        alert('해당 지역의 좌표를 찾을 수 없습니다.');
        return;
    }

    const { nx, ny } = coords;
    const apiKey = 'VQIJZ9c1Jfl%2BgmddvtNaDx%2BH2ftrrp4mtQ64zj8KUxrOwSgbb17ntnM8zDn4sWMTaPNjRzKwpQDkHdD07swd7w%3D%3D'; // 공공데이터포털에서 받은 인증키 입력
    const baseDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const baseTime = '0600'; // 예시로 06시 정시 데이터 사용

    const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${apiKey}&pageNo=1&numOfRows=10&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const items = data.response.body.items.item;
            displayWeather(items);
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('날씨 데이터를 가져오는 데 실패했습니다.');
        });
});

function displayWeather(items) {
    const weatherDetails = document.getElementById('weatherDetails');
    weatherDetails.innerHTML = ''; // 초기화

    items.forEach(item => {
        const category = getCategoryName(item.category);
        const obsrValue = item.obsrValue;

        const weatherItem = document.createElement('p');
        weatherItem.innerText = `${category}: ${obsrValue}`;
        weatherDetails.appendChild(weatherItem);
    });
}

function getCategoryName(category) {
    switch (category) {
        case 'RN1': return '강수량 (mm)';
        case 'T1H': return '기온 (℃)';
        case 'UUU': return '동서바람 성분 (m/s)';
        case 'VVV': return '남북바람 성분 (m/s)';
        case 'WSD': return '풍속 (m/s)';
        default: return '기타';
    }
}
