FROM jpillora/cloud-torrent
ENV PORT 8080
EXPOSE 8080
ENTRYPOINT ["cloud-torrent"]
