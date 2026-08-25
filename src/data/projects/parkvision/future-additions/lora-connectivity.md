### LoRa Wireless Camera Connectivity

Much of Acadia's trail-camera network sits well outside cellular coverage - remote overlooks, backcountry trailheads, and stretches of coastline where a phone simply has no signal. That rules out the obvious "just add a SIM card" answer to getting a camera's results off-site without a physical retrieval trip.

#### Goals
- **Cover the Gaps Cellular Can't**: Give cameras in dead zones a way to report in without depending on carrier coverage the park doesn't control and can't extend.
- **Low Power, Long Range**: Match the power budget of a solar- or battery-powered field camera - this only works if the radio link sips power for months at a time, not something that needs a wall outlet.

#### Planned Approach
- **LoRa Radio Links Between Cameras and a Gateway**: Equip each camera site with a low-power LoRa radio module (paired with a small microcontroller) that transmits compact detection summaries - not raw imagery - back to a single gateway with a real internet or cellular uplink, often placed at a visitor center or ranger station kilometers away. LoRa's whole design point is trading bandwidth for range and power efficiency, which is exactly the tradeoff a small JSON summary of visitor counts can afford to make.
- **Multi-Hop Relay Between Camera Sites**: For sites too far even from a single gateway, intermediate camera nodes could relay data hop-to-hop toward the nearest gateway, extending coverage across the park's terrain without needing a gateway at every isolated location.
- **Pairs Naturally With On-Camera Edge Processing**: This only becomes worth building once detection is already running on the camera itself (see the on-camera edge processing addition above) - LoRa's low bandwidth budget makes sense for shipping structured results, not for streaming video off-site.
