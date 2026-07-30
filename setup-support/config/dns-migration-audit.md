# DNS migration audit

Domain: fortunestudios.jp
New Cloudflare account ID: ac8c2578aeccae5fce1a75e0b4e47ca0

## Decision

Do not move fortunestudios.jp to the new Scarlet Cloudflare account.

The parent zone fortunestudios.jp is managed by another Cloudflare account.
This Scarlet setup should only use the subdomain:

- scarlet.fortunestudios.jp

The parent account should keep managing:

- fortunestudios.jp
- www.fortunestudios.jp
- existing Workers, routes, rules, redirects, and other subdomains

## Current public nameservers

- david.ns.cloudflare.com
- lara.ns.cloudflare.com

## Checked records

The following public DNS records matched records imported into the new Cloudflare zone:

- fortunestudios.jp A: 104.21.92.110, 172.67.192.21
- fortunestudios.jp AAAA: 2606:4700:3033::6815:5c6e, 2606:4700:3034::ac43:c015
- fortunestudios.jp MX: route1.mx.cloudflare.net, route2.mx.cloudflare.net, route3.mx.cloudflare.net
- fortunestudios.jp TXT: "v=spf1 include:_spf.mx.cloudflare.net ~all"
- aws.fortunestudios.jp NS: dns1.onamae.com, dns2.onamae.com
- k8s.fortunestudios.jp NS: dns1.onamae.com, dns2.onamae.com
- news.fortunestudios.jp NS: dns1.onamae.com, dns2.onamae.com
- newsletter.fortunestudios.jp NS: dns1.onamae.com, dns2.onamae.com
- track.fortunestudios.jp NS: dns1.onamae.com, dns2.onamae.com
- info.fortunestudios.jp A: 150.95.255.38
- ns1.fortunestudios.jp A: 150.95.255.38
- ns2.fortunestudios.jp A: 150.95.255.38
- www.dev.fortunestudios.jp A: 150.95.255.38
- dev.fortunestudios.jp TXT: "v=spf1 -all"
- resend._domainkey.fortunestudios.jp TXT: "v=spf1 -all"
- smtpapi._domainkey.fortunestudios.jp TXT: "v=spf1 -all"
- smtp._domainkey.fortunestudios.jp TXT: "v=spf1 -all"
- www.fortunestudios.jp TXT: "v=spf1 -all"
- zoho._domainkey.fortunestudios.jp TXT: "v=spf1 -all"

## Manual fix that should be reverted

Cloudflare did not import the current public A record for www.fortunestudios.jp.
Added this record to the new Cloudflare zone:

- www.fortunestudios.jp A 150.95.255.38, DNS only

Since www.fortunestudios.jp is managed by another account's Worker, this record should not remain in the Scarlet account zone.

## Remaining action

Do not switch nameservers.

The pending fortunestudios.jp zone was deleted from the Scarlet Cloudflare account after confirmation.

To connect Scarlet later, add scarlet.fortunestudios.jp in the parent Cloudflare account as a DNS record or Worker route/custom domain, depending on the deployment target.
