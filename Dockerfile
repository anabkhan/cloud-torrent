FROM jpillora/cloud-torrent
USER root
ENV PORT 8080
EXPOSE 8080
ENTRYPOINT ["cloud-torrent"]
