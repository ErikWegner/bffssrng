import { Issuer, Strategy, TokenSet } from 'openid-client';
import expressSesssion from 'express-session';
import passport from 'passport';
import { Application } from 'express';
import l from './logger';

export async function init(app: Application): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const myIssuer = await Issuer.discover(process.env.AUTH_DISCOVERYURL!);
  const client = new myIssuer.Client({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    client_id: process.env.AUTH_CLIENTID!,
    client_secret: process.env.AUTH_CLIENTSECRET,
    redirect_uris: ['http://localhost:4200/bff/auth/callback'],
    post_logout_redirect_uris: ['http://localhost:3000/bff/logout/callback'],
    token_endpoint_auth_method: 'client_secret_post',
  });

  app.use(
    expressSesssion({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: true,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    'oidc',
    new Strategy(
      { client },
      (
        tokenSet: TokenSet,
        _userinfo: unknown,
        done: (err: unknown, user?: unknown) => void
      ) => {
        l.info({ claims: tokenSet.claims() }, 'oidc Strategy');
        return done(null, tokenSet.claims());
      }
    )
  );

  passport.serializeUser((user, done) => {
    l.info({ user }, 'serializeUser');
    done(null, user);
  });
  passport.deserializeUser((user: never, done) => {
    l.info({ user }, 'deserializeUser');
    done(null, user);
  });

  // Setup routes
  app.get('/bff/auth', (req, res, next) => {
    passport.authenticate('oidc', {
      scope: 'openid',
    })(req, res, next);
  });
  app.get('/bff/auth/callback', (req, res, next) => {
    passport.authenticate('oidc', {
      successRedirect: '/api/v1/me',
      failureRedirect: '/',
    })(req, res, next);
  });
  app.get('/bff/logout', (_req, res) => {
    res.redirect(client.endSessionUrl());
  });
  app.get('/bff/logout/callback', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    req.logout(() => {});
    res.redirect('/');
  });
}
