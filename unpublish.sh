pkgs=(
    core
    # pages-fubao
    # pages-mchc
    # pages
    # components_m
    # components
    # service
    # provoke
    # env
    # utils
    # generator-lm            

)


main()
{



    for pkg in "${pkgs[@]}"; do
            for var in {33..89}; do
                npm unpublish @lm_fe/$pkg@0.1.$var --forece --registry=https://registry.npmjs.org/
            done
    done

}

main