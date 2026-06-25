<script>
    import AnimatedMasonry from '$lib/components/AnimatedMasonry.svelte';

    const galleryItems = [
        {
            src: '/img/animated/CHIMERAE.avif',
            title: 'CHIMERAE',
            href: 'https://www.youtube.com/watch?v=wjgFUC5X_bA',
        },
        {
            src: '/img/animated/thewrathofaniccocentman.avif',
            title: 'The Wrath of An Innocent Man',
            href: 'https://www.youtube.com/watch?v=xVwLTIkSX2A'
        },
        {
            src: '/img/animated/vr46.avif',
            title: 'VR 46 SAITN BARTH - Commercial',
            href: 'https://www.youtube.com/watch?v=STnD6jFhMxo'
        },
        {
            src: '/img/animated/usexperimental.avif',
            title: 'US - EXPERIMENTAL',
            href: 'https://www.youtube.com/watch?v=BB7oqF9xfME'
        },
        {
            src: '/img/animated/vmakimacrom.avif',
            title: 'VMAKI MACROM - LORD KNOWS',
            href: 'https://www.youtube.com/watch?v=OPR3Y5Qx-L8'
        },
        {
            src: '/img/animated/mostrono.avif',
            title: 'MOSTRO - NO VABBE\' AMO',
            href: 'https://www.youtube.com/watch?v=EfPjKEp9Yi8'
        },
        {
            src: '/img/animated/promessa.avif',
            title: 'PROMESSA - NON SEMBRIAMO FELICI',
            href: 'https://www.youtube.com/watch?v=Dzc7ROPYsv0'
        },
        {
            src: '/img/animated/vmakicashback.avif',
            title: 'VMAKI - CASHBACK FREESTYLE',
            href: 'https://www.youtube.com/watch?v=bVNJ-XqnEB8'
        },
        {
            src: '/img/animated/visinobianco.avif',
            title: 'VISINO BIANCO - SUL MURO DELLA MIA VIA',
            href: 'https://www.youtube.com/watch?v=9cqCdl0xqQs'
        },
        {
            src: '/img/animated/theosadboy.avif',
            title: 'THEO - SADBOY\'S BACK',
            href: 'https://www.youtube.com/watch?v=dPCIJuikV-k'
        },
        {
            src: '/img/animated/theopolverine.avif',
            title: 'THEO - POLVERINE',
            href: 'https://www.youtube.com/watch?v=0hZW4xDh4gM'
        },
        {
            src: '/img/animated/kemiolodio.avif',
            title: 'KEMIO - L\'ODIO CHE HAI PER ME',
            href: 'https://www.youtube.com/watch?v=1HlkUitcfBk'
        },
        {
            src: '/img/animated/berkelcampagna.avif',
            title: 'CAMPAGNA BERKEL',
            href: 'https://www.youtube.com/watch?v=3TInHJbLQ_0'
        },
        {
            src: '/img/animated/correre.avif',
            title: 'CORRERE',
            href: 'https://www.youtube.com/watch?v=zU_r0IXwogQ'
        },
        {
            src: '/img/animated/reelstolendreams.avif',
            title: 'REEL - STOLEN DREAMS',
            href: 'https://www.youtube.com/watch?v=6qXnD-GtuPE'
        },
        {
            src: '/img/animated/visinobiancononmia.avif',
            title: 'VISINO BIANCO - NON E\' MIA',
            href: 'https://www.youtube.com/watch?v=7Hyt-DA7j9A'
        },
        /*{
            src: '/img/animated/belehashishgum.avif',
            title: 'BELE\' HASHISH GUM',
            href: 'https://www.youtube.com/watch?v=-s-BQ_rQEP4'
        },*/
        {
            src: '/img/animated/interfinal.avif',
            title: 'INTER THE FINAL CHAPTER',
            href: 'https://www.youtube.com/watch?v=31l2fGPfmiU'
        },
        {
            src: '/img/animated/18kkwest.avif',
            title: '18K - K WEST',
            href: 'https://www.youtube.com/watch?v=q4I4KYWKN8E'
        },
        {
            src: '/img/animated/maxibanna.avif',
            title: 'MAXI B - ANNA',
            href: 'https://www.youtube.com/watch?v=Et6KXARQ3tA'
        },
        {
            src: '/img/animated/silentbobwtf.avif',
            title: 'SILENT BOB - WTF',
            href: 'https://www.youtube.com/watch?v=Pc-4-yoMfWo'
        },
        {
            src: '/img/animated/heretobe.avif',
            title: 'HERE TO BE - GQxBOGGIMILANO',
            href: 'https://www.youtube.com/watch?v=gWXnY9FjUhg'
        },
        {
            src: '/img/animated/matchjonathan.avif',
            title: 'MATCH JONATHAN - BOX FIGHTING',
            href: 'https://www.youtube.com/watch?v=FRGqhhSh74U'
        },
        {
            src: '/img/animated/18kbnkr44.avif',
            title: '18K - BNKR44 - LONTANO',
            href: 'https://www.youtube.com/watch?v=l6f2Ocw2dSk'
        },
        {
            src: '/img/animated/naughtylaundry.avif',
            title: 'Naughty Laundry',
            href: 'https://www.youtube.com/watch?v=df2McE8HWAQ'
        },
        {
            src: '/img/animated/beauty.avif',
            title: 'BEAUTY - HORROR',
            href: 'https://www.youtube.com/watch?v=dX-gVUVatfA'
        },
        {
            src: '/img/animated/365.avif',
            title: '365',
            href: 'https://www.youtube.com/watch?v=GmCXYQkDTDc'
        },
        {
            src: '/img/animated/cartomancer.avif',
            title: 'Cartomancer',
            href: 'https://www.youtube.com/watch?v=nB4wAcvS3BQ'
        },
        {
            src: '/img/animated/hunkwick.avif',
            title: 'Hunkwick',
            href: 'https://www.youtube.com/watch?v=fIEVIOEgCBA'
        },
        {
            src: '/img/animated/nolightindeepness.avif',
            title: 'No Light in Deepness',
            href: 'https://www.youtube.com/watch?v=kjOIvL3PduI'
        },
        {
            src: '/img/animated/serpe.avif',
            title: 'Serpe',
            href: 'https://www.youtube.com/watch?v=i14DAZqbb4U'
        },
        {
            src: '/img/animated/sonofuoco.avif',
            title: 'Sono Fuoco',
            href: 'https://www.youtube.com/watch?v=OyEEGCCFLqM'
        },
        {
            src: '/img/animated/visione.avif',
            title: 'Visione',
            href: 'https://www.youtube.com/watch?v=w2rkjSlp604'
        },
        {
            src: '/img/animated/possession.avif',
            title: 'Possession',
            href: 'https://www.youtube.com/watch?v=Jy-bTo98IE0'
        },
        {
            src: '/img/animated/noescape.avif',
            title: 'No Escape',
            href: 'https://www.youtube.com/watch?v=YA6ITZEdgq8'
        },
        {
            src: '/img/animated/kemiocuoreinarresto.avif',
            title: 'KEMIO - CUORE IN ARRESTO',
            href: 'https://www.youtube.com/watch?v=fsR0g5w7_oA'
        },
        {
            src: '/img/animated/jemeldiva.avif',
            title: 'Jemel - Diva',
            href: 'https://www.youtube.com/watch?v=wW766XaiSkA'
        },
        {
            src: '/img/animated/lacrimeesudore.avif',
            title: 'Lacrime e Sudore',
            href: 'https://www.youtube.com/watch?v=5gw4uN2MUSE'
        },
    ];
</script>

<!-- HOMEPAGE BODY -->
<div class="container-fluid pt-lg-2 homepage-content">

    <!-- Gallery Section -->
    <section class="row g-0 py-4 py-lg-5" id="portfolio-gallery" aria-labelledby="gallery-heading">
        <div class="col-12 text-center mb-4 mb-lg-5" data-aos="fade-down" data-aos-duration="500">
            <h1 class="display-4 fw-bold theme-text-primary gallery-heading" id="gallery-heading">
                MZEYFILMS
            </h1>
            <p class="lead theme-text-secondary gallery-subheading mt-2">
                Hover to reveal — click to watch
            </p>
        </div>

        <div class="col-12 px-2 px-md-4" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
            <AnimatedMasonry items={galleryItems} gap={12}/>
        </div>
    </section>

</div>

<style>
    .gallery-heading {
        letter-spacing: 0.08em;
        font-size: clamp(2rem, 6vw, 3.5rem);
    }

    .gallery-subheading {
        letter-spacing: 0.12em;
        font-size: clamp(0.85rem, 2vw, 1.1rem);
        text-transform: uppercase;
        opacity: 0.6;
    }

    #portfolio-gallery {
        min-height: 60vh;
    }

    @media (max-width: 575px) {
        .gallery-heading {
            font-size: 2rem;
        }
    }
</style>
