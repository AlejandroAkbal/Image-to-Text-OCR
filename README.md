<p align='center'>
  <img
  src='./public/favicon.svg'
  alt='Image to Text OCR' height='100'/>
</p>

<h1 align='center'>
Image to Text OCR
</h1>

[Image to Text OCR](https://image-to-text-ocr.netlify.app) is a utility website made by [Alejandro Akbal](https://akbal.dev)
for extracting text from any image using OCR.

This tool was made for those moments where you take a photo of some text and wish you could have it digitally.

![Preview](./public/social.jpg)

## Social

<a href="https://www.producthunt.com/posts/image-to-text-2?utm_source=badge-featured&utm_medium=badge" target="_blank">
    <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=364590&theme=dark" alt="Image&#0032;to&#0032;Text - Extract&#0032;text&#0032;from&#0032;any&#0032;image&#0032;using&#0032;OCR | Product Hunt"
    >
</a>

## Usage

### Development

Just run and visit <http://localhost:3000>

```bash
pnpm dev
```

### Build

To build the App, run

```bash
pnpm build
```

And you will see the generated files in `dist` that are ready to be served.

### Merge template

To merge the base GitHub template do:

```bash
git remote add template git@github.com:antfu/vitesse-nuxt3.git
git fetch --all

git merge --allow-unrelated-histories template/main
# Or
git merge template/main --strategy-option ours --squash
```
