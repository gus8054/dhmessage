// https://imagekit.io/docs/image-transformation

// 1. url 매개변수를 unknown으로 넓게 받고, 반환 타입을 `url is string`으로 지정합니다.
export function isImageKitUrl(url: unknown): url is string {
  return typeof url === "string" && url.includes("ik.imagekit.io");
}

// 2. url은 없을 수도 있으므로 undefined를 허용하고, transform은 확실한 string으로 받습니다.
export function withTransform(
  url: string | undefined,
  transform: string,
): string | undefined {
  if (!isImageKitUrl(url)) return url;

  const [path, query = ""] = url.split("?");
  const params = new URLSearchParams(query);
  params.set("tr", transform);

  return `${path}?${params.toString()}`;
}
