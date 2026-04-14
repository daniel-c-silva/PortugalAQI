import requests

AQ_API_KEY = "00cd6ae2c96fa65750f0231b0533a478c607368f"
SEARCH_TERM = "portugal"  # You can also use "porto", "lisboa", etc.

def find_valid_stations(keyword):
    url = f"https://waqi.info{AQ_API_KEY}&keyword={keyword}"
    response = requests.get(url)
    results = response.json()
    
    if results.get("status") == "ok":
        print(f"{'Station Name':<50} | {'Station ID/Path'}")
        print("-" * 75)
        for station in results["data"]:
            # 'uid' is the numeric ID you use with the @ prefix
            name = station["station"]["name"]
            uid = f"@{station['uid']}"
            print(f"{name:<50} | {uid}")
    else:
        print("Search failed.")

find_valid_stations(SEARCH_TERM)
