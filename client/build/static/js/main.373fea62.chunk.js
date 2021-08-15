(this["webpackJsonpmovie-mate"] = this["webpackJsonpmovie-mate"] || []).push([
  [0],
  {
    103: function (e, t, a) {},
    135: function (e, t, a) {
      "use strict";
      a.r(t);
      var n = a(0),
        c = a.n(n),
        r = a(13),
        s = a.n(r),
        i = (a(93), a(19)),
        o = a(29),
        l = a(16),
        j = a(70),
        u = a.n(j),
        b = a(5),
        m = a(2);
      var d = function () {
          return Object(m.jsxs)("div", {
            children: [
              Object(m.jsx)("h2", {
                children: "Welcome to the Movie Mate Recommendation Site",
              }),
              Object(m.jsx)("p", {
                children:
                  "You can use this website to see a plethora of movies and add them to the watch list!",
              }),
              Object(m.jsx)("br", {}),
              Object(m.jsx)("p", {
                children:
                  "You also can easily Like, Dislike, and rate the movies that you have watched to improve the recommendations!",
              }),
            ],
          });
        },
        h = (a(60), a(103), a(15)),
        p = a.n(h),
        v = a(23),
        x = a(173),
        O = a(186),
        g = a(72),
        f = a(73),
        y = a(35),
        w = a.n(y),
        k = "http://localhost:4200",
        S = new ((function () {
          function e() {
            Object(g.a)(this, e);
          }
          return (
            Object(f.a)(e, [
              {
                key: "explore",
                value: (function () {
                  var e = Object(v.a)(
                    p.a.mark(function e(t) {
                      var a, n, c;
                      return p.a.wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                return (e.next = 2), this.getToken();
                              case 2:
                                return (
                                  (a = e.sent),
                                  (n = new URLSearchParams()),
                                  t.page && n.set("page", t.page.toString()),
                                  t.q && n.set("q", t.q),
                                  t.maxDaysAgo &&
                                    n.set(
                                      "maxDaysAgo",
                                      t.maxDaysAgo.toString()
                                    ),
                                  t.genre && n.set("genre", t.genre),
                                  (e.next = 10),
                                  w.a.get(
                                    "".concat(k, "/movies/explore?").concat(n),
                                    {
                                      headers: {
                                        "Content-Type": "application/json",
                                        Authorization: "Bearer ".concat(a),
                                      },
                                    }
                                  )
                                );
                              case 10:
                                return (c = e.sent), e.abrupt("return", c.data);
                              case 12:
                              case "end":
                                return e.stop();
                            }
                        },
                        e,
                        this
                      );
                    })
                  );
                  return function (t) {
                    return e.apply(this, arguments);
                  };
                })(),
              },
              {
                key: "getGenres",
                value: (function () {
                  var e = Object(v.a)(
                    p.a.mark(function e() {
                      var t, a;
                      return p.a.wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                return (e.next = 2), this.getToken();
                              case 2:
                                return (
                                  (t = e.sent),
                                  (e.next = 5),
                                  w.a.get("".concat(k, "/movies/genres"), {
                                    headers: {
                                      "Content-Type": "application/json",
                                      Authorization: "Bearer ".concat(t),
                                    },
                                  })
                                );
                              case 5:
                                return (a = e.sent), e.abrupt("return", a.data);
                              case 7:
                              case "end":
                                return e.stop();
                            }
                        },
                        e,
                        this
                      );
                    })
                  );
                  return function () {
                    return e.apply(this, arguments);
                  };
                })(),
              },
              {
                key: "getToken",
                value: (function () {
                  var e = Object(v.a)(
                    p.a.mark(function e() {
                      var t;
                      return p.a.wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                return (
                                  (e.prev = 0),
                                  (t = b.a.auth().currentUser),
                                  (e.next = 4),
                                  t.getIdToken()
                                );
                              case 4:
                                return e.abrupt("return", e.sent);
                              case 7:
                                return (
                                  (e.prev = 7),
                                  (e.t0 = e.catch(0)),
                                  e.abrupt("return", null)
                                );
                              case 10:
                              case "end":
                                return e.stop();
                            }
                        },
                        e,
                        null,
                        [[0, 7]]
                      );
                    })
                  );
                  return function () {
                    return e.apply(this, arguments);
                  };
                })(),
              },
              {
                key: "getMovieByID",
                value: (function () {
                  var e = Object(v.a)(
                    p.a.mark(function e(t) {
                      var a, n;
                      return p.a.wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                return (e.next = 2), this.getToken();
                              case 2:
                                return (
                                  (a = e.sent),
                                  (e.next = 5),
                                  w.a.get("".concat(k, "/movies/").concat(t), {
                                    headers: {
                                      "Content-Type": "application/json",
                                      Authorization: "Bearer ".concat(a),
                                    },
                                  })
                                );
                              case 5:
                                return (n = e.sent), e.abrupt("return", n.data);
                              case 7:
                              case "end":
                                return e.stop();
                            }
                        },
                        e,
                        this
                      );
                    })
                  );
                  return function (t) {
                    return e.apply(this, arguments);
                  };
                })(),
              },
              {
                key: "addComment",
                value: (function () {
                  var e = Object(v.a)(
                    p.a.mark(function e(t, a) {
                      var n, c;
                      return p.a.wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                return (e.next = 2), this.getToken();
                              case 2:
                                return (
                                  (n = e.sent),
                                  (e.next = 5),
                                  w.a.post(
                                    ""
                                      .concat(k, "/movies/")
                                      .concat(t, "/comments"),
                                    {
                                      headers: {
                                        "Content-Type": "application/json",
                                        Authorization: "Bearer ".concat(n),
                                      },
                                      comment: a,
                                    }
                                  )
                                );
                              case 5:
                                return (c = e.sent), e.abrupt("return", c.data);
                              case 7:
                              case "end":
                                return e.stop();
                            }
                        },
                        e,
                        this
                      );
                    })
                  );
                  return function (t, a) {
                    return e.apply(this, arguments);
                  };
                })(),
              },
            ]),
            e
          );
        })())(),
        D = a(177),
        I = a(178),
        C = a(179),
        N = a(187),
        P = a(188),
        A = a(136),
        R = null,
        L = function (e) {
          var t = Object(l.g)(),
            a = Object(n.useState)([]),
            c = Object(i.a)(a, 2),
            r = c[0],
            s = c[1],
            j = Object(n.useState)([]),
            u = Object(i.a)(j, 2),
            b = u[0],
            d = u[1],
            h = Object(n.useState)(null),
            g = Object(i.a)(h, 2),
            f = g[0],
            y = g[1],
            w = Object(n.useState)(!1),
            k = Object(i.a)(w, 2),
            L = k[0],
            B = k[1];
          Object(n.useEffect)(function () {
            Object(v.a)(
              p.a.mark(function e() {
                var t;
                return p.a.wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (e.next = 2), S.getGenres();
                      case 2:
                        (t = e.sent), d(t);
                      case 4:
                      case "end":
                        return e.stop();
                    }
                }, e);
              })
            )();
          }, []),
            Object(n.useEffect)(
              function () {
                Object(v.a)(
                  p.a.mark(function e() {
                    var a, n, c, r, i, o;
                    return p.a.wrap(function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return (
                              (a = new URLSearchParams(t.search)),
                              (n = +a.get("page") || 1),
                              (c = a.get("q")),
                              (r = a.get("genre")),
                              (document.querySelector("input").value = c),
                              (i = { page: n, maxDaysAgo: 180 }),
                              (c || r) &&
                                (delete i.maxDaysAgo,
                                c && (i.q = c),
                                r && (i.genre = r)),
                              B(!0),
                              (e.next = 11),
                              S.explore(i)
                            );
                          case 11:
                            (o = e.sent), B(!1), y(o.pager), s(o.searchResults);
                          case 15:
                          case "end":
                            return e.stop();
                        }
                    }, e);
                  })
                )();
              },
              [t.search]
            );
          var T = function (a, n) {
              var c = new URLSearchParams(t.search);
              c.set("page", n.toString()),
                e.history.replace("/movies?".concat(c));
            },
            E = function (a) {
              var n = new URLSearchParams(t.search);
              n.set("genre", a.target.textContent.toLowerCase()),
                e.history.replace("/movies?".concat(n));
            };
          return Object(m.jsxs)("div", {
            children: [
              Object(m.jsx)("div", {
                children: L
                  ? Object(m.jsx)(x.a, { color: "secondary" })
                  : Object(m.jsx)("div", { className: "progress-placeholder" }),
              }),
              Object(m.jsxs)("div", {
                className: "chips",
                children: [
                  Object(m.jsx)(A.a, {
                    variant: "contained",
                    color: "primary",
                    onClick: function (a) {
                      var n = new URLSearchParams(t.search);
                      n.delete("genre"),
                        e.history.replace("/movies?".concat(n));
                    },
                    children: "Clear Genre",
                  }),
                  b.map(function (e) {
                    return Object(m.jsx)(P.a, { label: e, onClick: E }, e);
                  }),
                ],
              }),
              Object(m.jsx)(O.a, {
                label: "Search Movies",
                variant: "outlined",
                onChange: function (a) {
                  R && window.clearTimeout(R),
                    (R = setTimeout(function () {
                      var n = a.target.value,
                        c = new URLSearchParams(t.search);
                      n ? (c.set("q", n), c.set("page", "1")) : c.delete("q"),
                        e.history.replace("/movies?".concat(c));
                    }, 500));
                },
                InputLabelProps: { shrink: !0 },
              }),
              f && r.length
                ? Object(m.jsx)(N.a, {
                    page: null === f || void 0 === f ? void 0 : f.currentPage,
                    count: null === f || void 0 === f ? void 0 : f.totalPages,
                    onChange: T,
                  })
                : null,
              Object(m.jsx)("div", {
                children:
                  L || r.length || !t.search
                    ? null
                    : Object(m.jsx)("p", { children: "No Results" }),
              }),
              Object(m.jsx)(D.a, {
                rowHeight: 400,
                cols: 6,
                children: r.map(function (e) {
                  return Object(m.jsx)(
                    I.a,
                    {
                      children: Object(m.jsxs)(o.b, {
                        to: "movies/" + e.movieId,
                        children: [
                          e.movie.posterPath
                            ? Object(m.jsx)("img", {
                                src:
                                  "https://image.tmdb.org/t/p/w500/" +
                                  e.movie.posterPath,
                                alt: e.movie.title,
                              })
                            : Object(m.jsx)("p", {
                                className: "no-image-available",
                                children: "No image available",
                              }),
                          Object(m.jsx)(C.a, {
                            title: e.movie.title,
                            subtitle: Object(m.jsx)("span", {
                              children: e.movie.releaseYear,
                            }),
                          }),
                        ],
                      }),
                    },
                    e.movieId
                  );
                }),
              }),
              Object(m.jsx)("br", {}),
              f && r.length
                ? Object(m.jsx)(N.a, {
                    page: null === f || void 0 === f ? void 0 : f.currentPage,
                    count: null === f || void 0 === f ? void 0 : f.totalPages,
                    onChange: T,
                  })
                : null,
            ],
          });
        },
        B = function () {
          return Object(m.jsx)("h1", { children: "Not Found" });
        },
        T = a(180),
        E = function (e) {
          var t = Object(T.a)(function (e) {
              return {
                root: {
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-around",
                  overflow: "hidden",
                  backgroundColor: e.palette.background.paper,
                },
                imageList: { flexWrap: "nowrap", transform: "translateZ(0)" },
                title: { color: "black" },
                titleBar: { background: "white" },
              };
            })(),
            a = Object(n.useState)(b.a.auth().currentUser),
            c = Object(i.a)(a, 1)[0],
            r = Object(n.useState)(!1),
            s = Object(i.a)(r, 2),
            l = s[0],
            j = s[1],
            u = Object(n.useState)(null),
            d = Object(i.a)(u, 2),
            h = d[0],
            O = d[1],
            g = Object(n.useState)(void 0),
            f = Object(i.a)(g, 2),
            y = f[0],
            k = f[1],
            S = null,
            N = null;
          Object(n.useEffect)(
            function () {
              Object(v.a)(
                p.a.mark(function e() {
                  var t, a;
                  return p.a.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return (
                              console.log(h),
                              console.log(c),
                              (e.prev = 2),
                              j(!0),
                              (e.next = 6),
                              w.a.get("/users/".concat(c.uid))
                            );
                          case 6:
                            (t = e.sent),
                              (a = t.data),
                              console.log(a),
                              O(a),
                              j(!1),
                              (e.next = 17);
                            break;
                          case 13:
                            (e.prev = 13),
                              (e.t0 = e.catch(2)),
                              k(e.t0.messages),
                              console.log(y);
                          case 17:
                          case "end":
                            return e.stop();
                        }
                    },
                    e,
                    null,
                    [[2, 13]]
                  );
                })
              )();
            },
            [c, h, y]
          );
          return (
            h.wishList &&
              (S =
                h &&
                h.wishList.map(function (e) {
                  return (
                    (a = e),
                    Object(m.jsx)(
                      I.a,
                      {
                        children: Object(m.jsxs)(o.b, {
                          to: "movies/" + a.movieId,
                          children: [
                            a.img
                              ? Object(m.jsx)("img", {
                                  src: a.img,
                                  alt: a.title,
                                })
                              : Object(m.jsx)("p", {
                                  className: "no-image-available",
                                  children: "No image available",
                                }),
                            Object(m.jsx)(C.a, {
                              title: ""
                                .concat(a.title, " (")
                                .concat(a.year, ")"),
                              classes: { root: t.titleBar, title: t.title },
                            }),
                          ],
                        }),
                      },
                      a.movieId
                    )
                  );
                  var a;
                })),
            h.favorites &&
              (N =
                h &&
                h.favorites.map(function (e) {
                  return (
                    (a = e),
                    Object(m.jsx)(
                      I.a,
                      {
                        children: Object(m.jsxs)(o.b, {
                          to: "movies/" + a.movieId,
                          children: [
                            a.img
                              ? Object(m.jsx)("img", {
                                  src: a.img,
                                  alt: a.title,
                                })
                              : Object(m.jsx)("p", {
                                  className: "no-image-available",
                                  children: "No image available",
                                }),
                            Object(m.jsx)(C.a, {
                              title: ""
                                .concat(a.title, " (")
                                .concat(a.year, ")"),
                              classes: { root: t.titleBar, title: t.title },
                            }),
                          ],
                        }),
                      },
                      a.movieId
                    )
                  );
                  var a;
                })),
            Object(m.jsxs)("div", {
              children: [
                Object(m.jsx)("div", {
                  children: l
                    ? Object(m.jsx)(x.a, { color: "secondary" })
                    : Object(m.jsx)("div", {
                        className: "progress-placeholder",
                      }),
                }),
                Object(m.jsxs)("div", {
                  className: "profile-header",
                  children: [
                    Object(m.jsx)("img", { src: c.photoURL, alt: "Profile" }),
                    Object(m.jsxs)("p", {
                      children: ["Name: ", c.displayName],
                    }),
                    Object(m.jsxs)("p", { children: ["Email: ", c.email] }),
                  ],
                }),
                Object(m.jsx)("h2", { children: " My Favorites " }),
                Object(m.jsx)("div", {
                  className: t.root,
                  children: Object(m.jsx)(D.a, {
                    className: t.imageList,
                    rowHeight: 350,
                    cols: 4,
                    children: N,
                  }),
                }),
                Object(m.jsx)("p", { children: " << Scroll >> " }),
                Object(m.jsx)("h2", { children: " My Wish List " }),
                Object(m.jsx)("div", {
                  className: t.root,
                  children: Object(m.jsx)(D.a, {
                    className: t.imageList,
                    rowHeight: 350,
                    cols: 4,
                    children: S,
                  }),
                }),
                Object(m.jsx)("p", { children: " << Scroll >> " }),
              ],
            })
          );
        },
        M = a(184),
        W = a(185),
        U = a(183),
        q = a(79),
        F = a.n(q),
        z = a(137),
        G = a(181),
        Y = a(182),
        H = Object(T.a)(function (e) {
          return {
            root: { flexGrow: 1 },
            paper: { padding: e.spacing(2), margin: "auto", maxWidth: "auto" },
            image: { width: 128, height: 128 },
            img: {
              margin: "auto",
              display: "block",
              maxWidth: "100%",
              maxHeight: "100%",
            },
          };
        }),
        J = function (e) {
          var t = Object(n.useState)(void 0),
            a = Object(i.a)(t, 2),
            c = a[0],
            r = a[1],
            s = Object(n.useState)(""),
            o = Object(i.a)(s, 2),
            l = o[0],
            j = o[1],
            u = Object(n.useState)(!0),
            b = Object(i.a)(u, 2),
            d = b[0],
            h = b[1],
            x = H();
          return (
            Object(n.useEffect)(
              function () {
                function t() {
                  return (t = Object(v.a)(
                    p.a.mark(function t() {
                      var a;
                      return p.a.wrap(
                        function (t) {
                          for (;;)
                            switch ((t.prev = t.next)) {
                              case 0:
                                return (
                                  (t.prev = 0),
                                  (t.next = 3),
                                  S.getMovieByID(e.match.params.movieId)
                                );
                              case 3:
                                (a = t.sent),
                                  console.log(a),
                                  r(a),
                                  h(!1),
                                  console.log(c),
                                  (t.next = 13);
                                break;
                              case 10:
                                (t.prev = 10),
                                  (t.t0 = t.catch(0)),
                                  console.log(t.t0);
                              case 13:
                              case "end":
                                return t.stop();
                            }
                        },
                        t,
                        null,
                        [[0, 10]]
                      );
                    })
                  )).apply(this, arguments);
                }
                console.log("useEffect fired"),
                  (function () {
                    t.apply(this, arguments);
                  })();
              },
              [e.match.params.id]
            ),
            d
              ? Object(m.jsx)("div", { children: "Loading..." })
              : Object(m.jsxs)("div", {
                  children: [
                    Object(m.jsx)("br", {}),
                    Object(m.jsx)(z.a, {
                      className: x.paper,
                      children: Object(m.jsxs)(G.a, {
                        container: !0,
                        spacing: 3,
                        children: [
                          Object(m.jsxs)(G.a, {
                            item: !0,
                            children: [
                              Object(m.jsx)(
                                I.a,
                                {
                                  children: c.movieDetails.movie.posterPath
                                    ? Object(m.jsx)("img", {
                                        src:
                                          "https://image.tmdb.org/t/p/w500/" +
                                          c.movieDetails.movie.posterPath,
                                        alt: c.movieDetails.movie.title,
                                      })
                                    : Object(m.jsx)("p", {
                                        className: "no-image-available",
                                        children: "No image available",
                                      }),
                                },
                                c.movieDetails.movie.movieId
                              ),
                              Object(m.jsx)("br", {}),
                              Object(m.jsxs)(Y.a, {
                                children: [
                                  Object(m.jsx)(A.a, {
                                    id: "likeButton",
                                    children: "Like",
                                  }),
                                  Object(m.jsx)(A.a, {
                                    id: "wishlistButton",
                                    children: "Add to Wishlist",
                                  }),
                                  Object(m.jsx)(A.a, {
                                    id: "dislikeButton",
                                    children: "Dislike",
                                  }),
                                ],
                              }),
                            ],
                          }),
                          Object(m.jsx)("br", {}),
                          Object(m.jsx)(G.a, {
                            item: !0,
                            xs: 12,
                            sm: !0,
                            container: !0,
                            children: Object(m.jsx)(G.a, {
                              item: !0,
                              xs: !0,
                              container: !0,
                              direction: "column",
                              spacing: 2,
                              children: Object(m.jsxs)(G.a, {
                                item: !0,
                                xs: !0,
                                children: [
                                  Object(m.jsx)(U.a, {
                                    gutterBottom: !0,
                                    variant: "h2",
                                    children: c.movieDetails.movie.title,
                                  }),
                                  Object(m.jsx)(F.a, {
                                    rating: c.movieDetails.movie.avgRating,
                                    starRatedColor: "yellow",
                                    numberOfStars: 5,
                                    name: "rating",
                                  }),
                                  Object(m.jsx)("br", {}),
                                  Object(m.jsxs)(U.a, {
                                    variant: "body2",
                                    color: "textSecondary",
                                    children: [
                                      "Average Rating: ",
                                      c.movieDetails.movie.avgRating,
                                    ],
                                  }),
                                  Object(m.jsx)("br", {}),
                                  c.movieDetails.movie.genres &&
                                    Object(m.jsx)(Y.a, {
                                      children:
                                        c.movieDetails.movie.genres &&
                                        c.movieDetails.movie.genres.map(
                                          function (e) {
                                            return Object(m.jsx)(A.a, {
                                              children: e,
                                            });
                                          }
                                        ),
                                    }),
                                  Object(m.jsx)("br", {}),
                                  Object(m.jsx)("br", {}),
                                  Object(m.jsx)(U.a, {
                                    variant: "body2",
                                    gutterBottom: !0,
                                    children: c.movieDetails.movie.plotSummary,
                                  }),
                                  Object(m.jsx)("br", {}),
                                  Object(m.jsxs)(U.a, {
                                    variant: "body2",
                                    color: "textSecondary",
                                    children: [
                                      "Year Released: ",
                                      c.movieDetails.movie.releaseYear,
                                    ],
                                  }),
                                  c.movieDetails.movie.directors &&
                                    Object(m.jsxs)(G.a, {
                                      item: !0,
                                      xs: !0,
                                      container: !0,
                                      direction: "row",
                                      alignItems: "center",
                                      spacing: 2,
                                      children: [
                                        Object(m.jsx)(G.a, {
                                          item: !0,
                                          xs: !0,
                                          children: "Directors:",
                                        }),
                                        Object(m.jsx)(G.a, {
                                          item: !0,
                                          xs: !0,
                                          children: Object(m.jsx)(U.a, {
                                            gutterBottom: !0,
                                            variant: "body2",
                                            color: "textSecondary",
                                            children:
                                              c.movieDetails.movie.directors &&
                                              c.movieDetails.movie.directors.map(
                                                function (e) {
                                                  return Object(m.jsx)("p", {
                                                    children: e,
                                                  });
                                                }
                                              ),
                                          }),
                                        }),
                                      ],
                                    }),
                                  Object(m.jsx)("br", {}),
                                  Object(m.jsx)("h3", {
                                    children: "Comments:",
                                  }),
                                  Object(m.jsx)("br", {}),
                                  c.comments.length > 0
                                    ? c.comments.map(function (e) {
                                        return Object(m.jsxs)("div", {
                                          children: [
                                            Object(m.jsx)(z.a, {
                                              className: x.paper,
                                              children: "Hello",
                                            }),
                                            Object(m.jsx)("br", {}),
                                          ],
                                        });
                                      })
                                    : Object(m.jsx)("p", {
                                        children: "No comments",
                                      }),
                                  Object(m.jsx)("br", {}),
                                  Object(m.jsx)("h3", {
                                    children: "Add a comment:",
                                  }),
                                  Object(m.jsx)(z.a, {
                                    className: x.paper,
                                    children: Object(m.jsxs)("form", {
                                      onSubmit: function (t) {
                                        t.preventDefault(),
                                          S.addComment(
                                            e.match.params.movieId,
                                            l
                                          ),
                                          alert("Comment Added");
                                      },
                                      children: [
                                        Object(m.jsx)("label", {
                                          children: Object(m.jsx)("input", {
                                            type: "text",
                                            name: "comment",
                                            onChange: function (e) {
                                              j(e.target.value);
                                            },
                                            value: l,
                                          }),
                                        }),
                                        Object(m.jsx)("input", {
                                          type: "submit",
                                          value: "Submit",
                                        }),
                                      ],
                                    }),
                                  }),
                                ],
                              }),
                            }),
                          }),
                        ],
                      }),
                    }),
                  ],
                })
          );
        };
      b.a.apps.length ||
        b.a.initializeApp({
          apiKey: "AIzaSyDYk4I-2c5E72cvb_wJwg3syt7xjrAssQg",
          authDomain: "movie-mate-43364.firebaseapp.com",
          projectId: "movie-mate-43364",
          storageBucket: "movie-mate-43364.appspot.com",
          messagingSenderId: "174076031402",
          appId: "1:174076031402:web:a5609b82cf4905d55c3bd3",
          measurementId: "G-54RM0PJWCW",
        });
      var _ = {
        signInFlow: "popup",
        signInOptions: [
          b.a.auth.EmailAuthProvider.PROVIDER_ID,
          b.a.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
          signInSuccessWithAuthResult: function () {
            return !1;
          },
        },
      };
      var V = function () {
          var e = Object(n.useState)(!1),
            t = Object(i.a)(e, 2),
            a = t[0],
            c = t[1];
          return (
            Object(n.useEffect)(function () {
              b.a.auth().onAuthStateChanged(function (e) {
                c(!!e);
              });
            }, []),
            Object(m.jsx)(o.a, {
              children: Object(m.jsxs)("div", {
                className: "App",
                children: [
                  Object(m.jsx)(M.a, {
                    position: "static",
                    children: Object(m.jsxs)(W.a, {
                      children: [
                        Object(m.jsx)(U.a, {
                          variant: "h6",
                          children: Object(m.jsx)(o.b, {
                            to: "/movies",
                            children: "Movie Mate",
                          }),
                        }),
                        Object(m.jsx)(U.a, {
                          variant: "h6",
                          children: Object(m.jsx)(o.b, {
                            to: "/profile",
                            children: "Profile",
                          }),
                        }),
                        a
                          ? Object(m.jsx)(A.a, {
                              color: "inherit",
                              onClick: function () {
                                return b.a.auth().signOut();
                              },
                              children: "Sign-out",
                            })
                          : null,
                      ],
                    }),
                  }),
                  a
                    ? Object(m.jsx)("div", {
                        className: "App-body",
                        children: Object(m.jsxs)(l.d, {
                          children: [
                            Object(m.jsx)(l.b, {
                              exact: !0,
                              path: "/movies",
                              component: L,
                            }),
                            Object(m.jsx)(l.b, {
                              exact: !0,
                              path: "/movies/:movieId",
                              component: J,
                            }),
                            Object(m.jsx)(l.b, {
                              exact: !0,
                              path: "/404",
                              component: B,
                            }),
                            Object(m.jsx)(l.b, {
                              exact: !0,
                              path: "/profile",
                              component: E,
                            }),
                            Object(m.jsx)(l.a, { from: "", to: "/movies" }),
                          ],
                        }),
                      })
                    : Object(m.jsxs)("div", {
                        className: "App-body",
                        children: [
                          Object(m.jsx)(d, {}),
                          Object(m.jsx)("p", { children: "Please sign-in:" }),
                          Object(m.jsx)(u.a, {
                            uiConfig: _,
                            firebaseAuth: b.a.auth(),
                          }),
                        ],
                      }),
                ],
              }),
            })
          );
        },
        K = function (e) {
          e &&
            e instanceof Function &&
            a
              .e(3)
              .then(a.bind(null, 189))
              .then(function (t) {
                var a = t.getCLS,
                  n = t.getFID,
                  c = t.getFCP,
                  r = t.getLCP,
                  s = t.getTTFB;
                a(e), n(e), c(e), r(e), s(e);
              });
        };
      s.a.render(
        Object(m.jsx)(c.a.StrictMode, { children: Object(m.jsx)(V, {}) }),
        document.getElementById("root")
      ),
        K();
    },
    93: function (e, t, a) {},
  },
  [[135, 1, 2]],
]);
//# sourceMappingURL=main.373fea62.chunk.js.map
