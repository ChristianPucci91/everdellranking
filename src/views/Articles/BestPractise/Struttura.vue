<script setup>
    import Article from '../../../components/Article.vue'
    import CodeBlock from '../../../components/CodeBlock.vue'
    import { defineProps, ref, defineExpose } from 'vue'

    const articleRef = ref(null)

    defineExpose({
        get el() {
            return articleRef.value?.el
        },
        get label() {
            return articleRef.value?.label
        }
    })

    const props = defineProps({
     label: String
    })

</script>
<template>
    <Article :label="label" ref="articleRef">
        <template #subtitle>
            <p>
                In questo articolo parleremo di come dovrebbero essere impostate le cartelle su un progetto
                Laravel<br>
                Laravel offre già una struttura ordinata, ma puoi migliorarla in base alle esigenze del tuo
                progetto:
            </p>
        </template>
        <template #text>

            <ol class="subtitle-list">
                <li>
                    <h4 class="my-4">Struttura folders funzionalità</h4>
                    <ol class="normal-list">
                        <li>
                            <span class="subtitle-span">Overview:</span>

                            <ul class="normal-list">
                                <li>
                                    <code>Controllers/Admin </code>
                                    <span><em class="comments">Se il tuo progetto prevede funzionalità per ruoli</em></span>
                                </li>
                                <li>
                                    <code>Controllers/Api </code>
                                    <span><em class="comments">Se il tuo progetto prevede delle API</em></span>
                                </li>
                                <li>
                                    <code>Controllers/Auth </code>
                                    <span><em class="comments">Se il tuo progetto prevede delle funzionalità legate a chi è autenticato</em></span>
                                </li>
                                <li>
                                    <code>Controllers/Guest </code>
                                    <span><em class="comments">Se il tuo progetto prevede delle funzionalità legate a chi NON è autenticato</em></span>
                                </li>
                            </ul>

                            <p>Se l'applicativo è basato su operazioni simili ma diversificate per ruolo, si può
                                suddividere per Backend e Frontend come macro folders</p>
                            <ul class="normal-list">
                                <li><code>Controllers/Backend/...lista di controller </code></li>
                                <li><code>Controllers/Frontend/...lista di controller </code></li>
                            </ul>
                        </li>

                        <li>
                            <span class="subtitle-span">Organizzazione per feature/domain-driven</span>
                            <p>Invece di avere una cartella Controllers o Models unica, puoi raggruppare i file per dominio o funzionalità del business. Es:</p>
                            <ul class="normal-list code">
                                <li>
                                    <code>
                                        app/
                                        <ul>
                                            <li>
                                                Domains/
                                                <ul>
                                                    <li>
                                                        User/
                                                        <ul>
                                                            <li>
                                                                Models/ 
                                                                <ul>
                                                                    <li>User.php</li>
                                                                </ul>
                                                            </li>
                                                            <li>
                                                                Controllers/ 
                                                                <ul>
                                                                    <li>UserController.php</li>
                                                                </ul>
                                                            </li>
                                                            <li>
                                                                Services/ 
                                                                <ul>
                                                                    <li>UserService.php</li>
                                                                </ul>
                                                            </li>
                                                            <li>
                                                                Requests/ 
                                                                <ul>
                                                                    <li>UserRequest.php</li>
                                                                </ul>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        Product/
                                                        <ul>
                                                            <li>
                                                                Models/ 
                                                                <ul>
                                                                    <li>Product.php</li>
                                                                </ul>
                                                            </li>
                                                            <li>
                                                                Controllers/ 
                                                                <ul>
                                                                    <li>ProductController.php</li>
                                                                </ul>
                                                            </li>
                                                            <li>
                                                                Services/ 
                                                                <ul>
                                                                    <li>ProductService.php</li>
                                                                </ul>
                                                            </li>
                                                            <li>
                                                                Requests/ 
                                                                <ul>
                                                                    <li>ProductRequest.php</li>
                                                                </ul>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </code>
                                </li>
                            </ul>
                            <p>Vantaggi</p>
                            <ul class="normal-list">
                                <li>Isola le feature, più facile da trovare e mantenere.</li>
                                <li>Favorisce team che lavorano in parallelo su moduli diversi.</li>
                                <li>Scalabilità naturale.</li>
                            </ul>

                        </li>

                        <li>
                            <span class="subtitle-span">Separazione chiara dei ruoli (design pattern)</span>
                            <ul class="normal-list">
                                <li><strong>Models:</strong> Solo modelli Eloquent (in <code>app/Models</code> o in un namespace <code>Domain\Model</code>).</li>
                                <li><strong>Controllers:</strong> Controllano il flusso HTTP, risposte, validazioni, e chiamano servizi.</li>
                                <li><strong>Models:</strong> Validazione in <code>app/Http/Requests.</code></li>
                                <li><strong>Services ( o Use Cases):</strong> Logica di business complessa fuori dai controller (es. <code>app/Services</code> o dentro il dominio).</li>
                                <li><strong>Repositories:</strong> Accesso ai dati, query DB, a volte usati per separare l’ORM da logiche di query.</li>
                                <li><strong>Jobs:</strong> Per operazioni asincrone, code, o task pianificati.</li>
                                <li><strong>Events e Listeners:</strong> Per gestire eventi e reazioni in modo decoupled.</li>
                                <li><strong>Policies e Gates:</strong> Per autorizzazioni e controlli di accesso.</li>
                                <li><strong>Resources:</strong> Per trasformare modelli in risorse API (es. <code>app/Http/Resources</code>).</li>
                                <li><strong>Notifications:</strong> Per inviare notifiche (es. <code>app/Notifications</code>).</li>
                                <li><strong>Mail:</strong> Per gestire l'invio di email (es. <code>app/Mail</code>).</li>
                                <li><strong>Middleware:</strong> Per logica di filtraggio delle richieste HTTP (es. <code>app/Http/Middleware</code>).</li>
                                <li><strong>Policies:</strong> Per autorizzazioni e controlli di accesso (es. <code>app/Policies</code>).</li>
                                <li><strong>Form Requests:</strong> Per validazione delle richieste HTTP (es. <code>app/Http/Requests</code>).</li>
                            </ul>
                        </li>

                        <li>
                            <span class="subtitle-span">Service Layer (Business Logic)</span>
                            <p>Non mettere tutta la logica di business nel controller o nel modello. Usa una cartella Services o Actions:</p>
                            <ul class="normal-list code">
                                <li>
                                    <code>
                                        app/
                                        <ul>
                                            <li>
                                                Services/
                                                <ul>
                                                    <li>
                                                        UserService.php

                                                    </li>
                                                    <li>
                                                        PaymentService.php
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </code>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <span class="subtitle-span">Form Request per validazioni</span>
                            <p>Separare la validazione in classi specifiche:</p>
                            <ul class="normal-list code">
                                <li>
                                    <code>
                                        app/
                                        <ul>
                                            <li>
                                                Http/
                                                <ul>
                                                    <li>
                                                        Requests/
                                                        <ul>
                                                            <li>StoreUserRequest.php</li>
                                                            <li>UpdateProductRequest.php</li>
                                                        </ul>
                                                    </li>

                                                </ul>
                                            </li>
                                        </ul>
                                    </code>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <span class="subtitle-span">Repository Pattern (opzionale)</span>
                            <p>Per evitare dipendenza diretta da Eloquent e facilitare testing, puoi creare un repository per ogni modello:</p>
                            <ul class="normal-list code">
                                <li>
                                    <code>
                                        app/
                                        <ul>
                                            <li>
                                                Repositories/
                                                <ul>
                                                    <li>
                                                        UserRepository.php
                                                    </li>
                                                    <li>
                                                        ProductRepository.php
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </code>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <span class="subtitle-span">Domain Event & Listener</span>
                            <p>Usare eventi per le azioni asincrone:</p>
                            <ul class="normal-list code">
                                <li>
                                    <code>
                                        app/
                                        <ul>
                                            <li>
                                                Events/
                                                <ul>
                                                    <li>
                                                        UserRegistered.php
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                Listeners/
                                                <ul>
                                                    <li>
                                                        SendWelcomeEmail.php
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </code>
                                </li>
                            </ul>
                        </li>
                    </ol>
                </li>
                <li>
                    <h4 class="my-4">Struttura folders viste, assets e files</h4>
                    <ol class="normal-list">
                        <li>
                            <span class="subtitle-span">Organizzazione Routes</span>
                            <p>Organizza le rotte in file separati in routes/</p>
                            <ul class="normal-list">
                                <li>web.php</li>
                                <li>api.php</li>
                                <li>admin.php</li>
                                <li>channels.php</li>
                            </ul>
                        </li>
                        <li>
                            <span class="subtitle-span">Organizza per sezione o dominio:</span>
                            <p>Evita di avere tutte le view in un’unica cartella. Struttura le cartelle per area funzionale:</p>
                            <ul class="normal-list code">
                                <li>
                                    <code>
                                        views/
                                        <ul>
                                            <li>
                                                layouts/
                                                <ul>
                                                    <li>
                                                        app.blade.php
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                auth/
                                                <ul>
                                                    <li>
                                                        login.blade.php
                                                    </li>
                                                    <li>
                                                        register.blade.php
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                dashboard/
                                                <ul>
                                                    <li>
                                                        index.blade.php
                                                    </li>
                                                    <li>
                                                        profile.blade.php
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                admin/
                                                <ul>
                                                    <li>
                                                        users/index.blade.php
                                                    </li>
                                                    <li>
                                                        settings/profile.blade.php
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </code>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <span class="subtitle-span">Usa <code>partials/</code> per componenti riutilizzabili</span>
                            <p>Per menu, sidebar, alert, modali:</p>
                            <ul class="normal-list code">
                                <li>
                                    <code>
                                        views/
                                        <ul>
                                            <li>
                                                partials/
                                                <ul>
                                                    <li>
                                                        nav.blade.php
                                                    </li>
                                                        <li>
                                                        sidebar.blade.php
                                                    </li>
                                                        <li>
                                                        alert.blade.php
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </code>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <span class="subtitle-span">Ecco una struttura di esempio per gli assets</span>
                            <ul class="normal-list code">
                                <li>
                                    <code>
                                        resources/
                                        <ul>
                                            <li>
                                                css/
                                                <ul>
                                                    <li>
                                                        app.css <em class="comments">&larr; punto di ingresso vite </em>
                                                    </li>
                                                    <li>
                                                        main.scss <em class="comments">&larr; file principale SCSS (se usi Sass) </em>
                                                    </li>
                                                    <li>
                                                        variables/
                                                        <ul>
                                                            <li>
                                                                _colors.scss <em class="comments">&larr; variabili di colori </em>
                                                            </li>
                                                            <li>
                                                                _typography.scss <em class="comments">&larr; font, grandezze </em>
                                                            </li>
                                                            <li>
                                                                _spacings.scss <em class="comments">&larr; margini, padding </em>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        components/
                                                        <ul>
                                                            <li>
                                                                _button.scss <em class="comments">&larr; stili per i bottoni </em>
                                                            </li>
                                                            <li>
                                                                _card.scss <em class="comments">&larr; stili per le card </em>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                js/
                                                <ul>
                                                    <li>
                                                        app.js <em class="comments">&larr; punto di ingresso vite </em>
                                                    </li>
                                                    <li>
                                                        components/
                                                        <ul>
                                                            <li>
                                                                Navbar.vue <em class="comments">&larr; componente navbar </em>
                                                            </li>
                                                            <li>
                                                                Modal.vue <em class="comments">&larr; componente modale </em>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </code>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <span class="subtitle-span">Storage</span>
                            <p>Usa la directory <code>storage/app</code> per file privati</p>
                            <p>Usa la directory <code>storage/app/public</code> per file pubblici e crea un link simbolico</p>
                            <p>Cloud storage (Amazon S3, Google Cloud, Azure, etc.):</p>
                            <ul class="normal-list">
                                                     
                                <li>Usa driver cloud per scalabilità e disponibilità.</li>
                                <li>Usa driver cloud per scalabilità e disponibilità.</li>
                                <li>Usa driver cloud per scalabilità e disponibilità.</li>
                                <li>Usa driver cloud per scalabilità e disponibilità.</li>
                        
                            </ul>
                                <CodeBlock :code="`Storage::disk('s3')->put('documenti/riservato.pdf', $content, 'private');`" language="php" />                                

                            <div>
                                <p>Configurazione S3 esempio:</p>
                                <CodeBlock :code="`AWS_ACCESS_KEY_ID=xxx\nAWS_SECRET_ACCESS_KEY=xxx\nAWS_DEFAULT_REGION=eu-central-1\nAWS_BUCKET=nome-bucket\nAWS_URL=https://bucket.s3.amazonaws.com\n`" language="ini" />
                            </div>
                            <div>
                                <p>Nel <code>config/filesystems.php</code>:</p>
                                <CodeBlock :code="`<?php\n's3' => [\n    'driver' => 's3',\n    'key' => env('AWS_ACCESS_KEY_ID'),\n    'secret' => env('AWS_SECRET_ACCESS_KEY'),\n    'region' => env('AWS_DEFAULT_REGION'),\n    'bucket' => env('AWS_BUCKET'),\n    'url' => env('AWS_URL'),\n    'visibility' => 'private',\n],\n?>`" language="php" />
                            </div>
                            <p>Best practice generale</p>
                            <ul class="normal-list">
                                                     
                                <li>Usa sottocartelle per tipologie: invoices/, avatars/, logs/, ecc.</li>
                                <li>Evita nomi di file prevedibili (usa <code>Str::uuid()</code> o hash).</li>
                                <li>Controlla sempre la dimensione massima dei file e tipo MIME in upload.</li>
                                <li>Proteggi l’accesso ai file con autenticazione/autorizzazione dove necessario.</li>
                        
                            </ul>
                            <p>Best practice backup</p>
                            <ul class="normal-list">
                                                     
                                <li>Backup automatici con Laravel Spatie Backup.</li>
                                <li>Sincronizza contenuti statici da local a cloud per distribuzione CDN.</li>
                                <li>Salva i backup critici in dischi separati (s3, local-backup, ecc.).</li>
                        
                            </ul>
                        </li>
                    </ol>
                </li>
            </ol>

        </template>
    </Article>
</template>



