<script>
/**
 * Widget Component
 */
export default {
  data() {
    return {
      statData: [
        {
          heading: " PDUI Indonesia ",
          background: "background: darkmagenta",
          text: "Keberadaan UU Nomor 29 tahun 2004 tentang praktek kedokteran memberikan perlindungan hukum terhadap profesi di satu sisi",
          img: "../../assets/images/authentication-bg",
        },
        {
          heading: "Blood Health ",
          background: "background: darkslateblue",
          text: "Introducing Nerve Care Forum, your one-stop solution to all prosthodontic-related concerns.",
        },
        {
          heading: "Nerve Care Forum",
          background: "background: deeppink",
          text: "Atas dasar tuntutan profesi yang mengarahkan dokter umum untuk mengembangkan dirinya sebagai professional yang mampu menjawab kebutuhan layanan kesehatan.",
        },
      ],
    };
  },
};
</script>

<template>
  <div class="row">
    <div class="col-md-4" v-for="(data, index) in statData" :key="index">
      <div
        class="card"
        style="
          box-shadow: 0 4px 6px -1pxrgba (0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06) !important !important;
          border-radius: 0.75rem;
        "
      >
        <div class="mt-n11 card-header forum-card" style="background: transparent !important; margin-top: -30px">
          <div
            class="text-dark font-size-24 d-block blur-shadow-image"
            style=""
          >
            <!-- <i style="color: #fff" :class="data.icon"></i> -->
            <img
              src="@/assets/images/authentication-bg.jpg"
              alt="forum-img"
              class="img-fluid shadow border-radius-lg"
              style="
                box-shadow: 0 4px 6px -1pxrgba (0, 0, 0, 0.1),
                  0 2px 4px -1px rgba(0, 0, 0, 0.06) !important !important;
                border-radius: 0.75rem;
              "
            />
            <div
              class=""
              style="
                ransform: scale(0.94);
                top: 0.5%;
                filter: blur(12px);
                position: absolute;
                left: 0;
                width: 100%;
                height: 100%;
                background-size: cover;
                z-index: -1;
                background: 'url('@/assets/images/authentication-bg.jpg')'
              "
            ></div>
          </div>
        </div>
        <div class="card-body">
          <div class="media">
            <!-- <div class="media-body overflow-hidden">
              <h5 class="text-truncate font-size-14 mb-2">{{ data.title }}</h5>
              <h4 class="mb-0">{{ data.value }}</h4>
            </div> -->
          </div>
          <div class="text-center mt-4">
            <h6 class="text-primary" style="font-weight: bold">
              <!-- <i class="mdi mdi-menu-up"></i> -->
              {{ data.heading }}
            </h6>
            <h6
              class="ml-2"
              style="
                display: -webkit-box;
                -webkit-line-clamp: 3;
                overflow: hidden;
                height: 52px;
              "
            >
              {{ data.text }}
            </h6>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- end row -->
</template>
