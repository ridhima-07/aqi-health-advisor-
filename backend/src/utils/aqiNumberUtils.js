const PM2_5_breakpoints = [
  { cLow: 0.0, cHigh: 9.0, iLow: 0, iHigh: 50 },
  { cLow: 9.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
  { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150},
  { cLow: 55.5, cHigh: 125.4, iLow: 151, iHigh: 200},
  { cLow: 125.5, cHigh: 225.4, iLow: 201, iHigh: 300},
  { cLow: 225.5, cHigh: 325.4, iLow: 301, iHigh: 500},
];

const PM_10_breakpoints = [
    { cLow: 0, cHigh: 54, iLow: 0, iHigh: 50},
    { cLow: 55, cHigh: 154, iLow: 51, iHigh: 100},
    { cLow: 155, cHigh: 254, iLow: 101, iHigh: 150},
    { cLow: 255, cHigh: 354, iLow: 151, iHigh: 200},
    { cLow: 355, cHigh: 424, iLow: 201, iHigh: 300},
    { cLow: 425, cHigh: 604, iLow: 301, iHigh: 500},
]

function calcAQI ( concentration, breakpoints )
{
    for ( let bp of breakpoints)
    {
        if ( concentration >= bp.cLow && concentration <= bp.cHigh )
        {
            const {cLow, cHigh, iLow, iHigh} = bp;
            const index = ((iHigh - iLow) / (cHigh - cLow))*(concentration - cLow)+ iLow;
            return Math.round(index);
        }
    }
    return 500;
};

function getpm25AQI ( pm25 )
{
    return calcAQI ( pm25, PM2_5_breakpoints );
};

function getpm10AQI ( pm10 )
{
    return calcAQI ( pm10, PM_10_breakpoints );
};

export function calcAQINumber ( pollutants )
{
    const pm25 = pollutants.pm2_5;
    const pm10 = pollutants.pm10;

    const pm25AQI = getpm25AQI( pm25 );
    const pm10AQI = getpm10AQI( pm10 );

    let aqiValue = pm25AQI;
    let dominantPollutant = "pm2_5";

    if ( pm10AQI > pm25AQI )
    {
        aqiValue = pm10AQI;
        dominantPollutant = "pm10";
    }

    return {aqiValue, dominantPollutant};
}
