##### This repository serves as a dummy API server to produce random ad performance to test a candidate's ability to create an ad budget scaler.

In this exercise, your task is to resolve the bug issues found in the issues section of this repository. There are 3 issues in total with varying difficulty.

## Usage
```
node server.js
```

## Install
```
npm install
```

## Fetching Performance from the API

You’ll be fetching data from the API server located at `http://localhost:3030`. To authenticate use the access token `SHAREABLY_SECRET_TOKEN` in either the `Authorization` header or in the query parameter `accessToken`.

Use the GET `/ad-insights` endpoint to fetch ad performance data. The parameters used for this endpoint are written below:

| Parameter | Description | Example |
| ----------- | ----------- | ----------- |
| date | The date to fetch ad data for. The date should be formatted in **YYYY-MM-DD** format and valid dates range from **2019-01-25 to 2019-01-31** `REQUIRED` | 2019-01-25 |
| metrics | A comma separated list of metrics you want returned by the server. See below for a complete list `REQUIRED` | spend,impressions |

| Metric | Description |
| ----------- | ----------- |
| spend | The total amount spent |
| revenue | The total dollar amount brought in by the ad |
| impressions | The total number of times the ad was shown to users |
| clicks | The total number of times a user click on the ad |

Use the GET `/ad/AD_ID` endpoint to get the current ad budget for an ad. **The budget total is FIXED**.

| Parameter | Description | Example |
| ----------- | ----------- | ----------- |
| AD_ID | The ad id to fetch current ad budget for. `REQUIRED` | 081944fe-aa73-6165-3f4c-3ab87a1539fe |
