"use server";

export async function getAvgTmp(fromDate: string, toDate: string) {
  let url = `https://meteostat.p.rapidapi.com/stations/daily?station=D2465&start=${fromDate}&end=${toDate}`;

  const response = await fetch(url, {
    headers: {
      "x-rapidapi-host": "meteostat.p.rapidapi.com",
      "x-rapidapi-key": process.env.API_KEY!,
    },
  });

  if (response.ok) {
    const result = await response.json();
    const relevantData = result.data.filter((d: any) => d.tavg !== null);
    const avgTemperatures = relevantData.map((item: any) => item.tavg);
    const avgTmp =
      avgTemperatures.reduce((a: number, b: number) => a + b, 0) /
      avgTemperatures.length;
    return { avgTmp };
  }
  return { error: true };
}
